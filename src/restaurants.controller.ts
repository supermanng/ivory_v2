import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  DefaultValuePipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurants.interface';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('restaurants')
@Controller('v1/restaurants')
@UseGuards(ThrottlerGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns list of restaurants based on provided criteria.',
  })
  @ApiNotFoundResponse({
    description: 'The provided city is not valid or not supported.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters.' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'latitude', required: false })
  @ApiQuery({ name: 'longitude', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @ApiQuery({ name: 'cuisine', required: false })
  @ApiQuery({ name: 'priceRange', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  findRestaurants(
    @Query('city', new DefaultValuePipe('')) city?: string,
    @Query('latitude', new DefaultValuePipe('')) latitude?: string,
    @Query('longitude', new DefaultValuePipe('')) longitude?: string,
    @Query('distance', new DefaultValuePipe('')) distance?: string,
    @Query('cuisine', new DefaultValuePipe('')) cuisine?: string,
    @Query('priceRange', new DefaultValuePipe('')) priceRange?: string,
    @Query('minRating', new DefaultValuePipe('')) minRating?: number,
  ): Restaurant[] {
    let lat: number, lon: number, dist: number;

    if (latitude && longitude) {
      lat = parseFloat(latitude);
      lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        throw new BadRequestException('Invalid latitude or longitude.');
      }
    }

    if (distance) {
      dist = parseFloat(distance);

      if (isNaN(dist) || dist < 0) {
        throw new BadRequestException(
          'Distance must be a non-negative number.',
        );
      }
    }

    // Validate minRating
    if (minRating && (isNaN(minRating) || minRating < 0 || minRating > 5)) {
      throw new BadRequestException(
        'Minimum rating must be a number between 0 and 5.',
      );
    }

    // Logic to filter restaurants based on criteria
    let filteredRestaurants = this.restaurantsService.findAll();

    if (city) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.address.toLowerCase().includes(city.toLowerCase()),
      );
      if (!filteredRestaurants.length) {
        throw new NotFoundException('City not found or not supported.');
      }
    }

    if (lat && lon && dist) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) =>
          this.calculateDistance(
            lat,
            lon,
            restaurant.latitude,
            restaurant.longitude,
          ) <= dist,
      );
    }

    // Filter by cuisine
    if (cuisine) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase()),
      );
    }

    // Filter by price range
    if (priceRange) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) => restaurant.priceRange === priceRange,
      );
    }

    // Filter by minimum rating
    if (minRating) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) => restaurant.rating >= minRating,
      );
    }

    return filteredRestaurants;
  }
  @Get(':name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a single restaurant by name.',
  })
  @ApiNotFoundResponse({ description: 'Restaurant not found.' })
  getRestaurant(@Param('name') name: string): Restaurant {
    return this.restaurantsService.findOneByName(name);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Restaurant successfully added.' })
  addRestaurant(@Body() restaurant: Restaurant): Restaurant {
    return this.restaurantsService.addOne(restaurant);
  }

  @Put(':name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant successfully updated.',
  })
  updateRestaurant(
    @Param('name') name: string,
    @Body() updatedRestaurant: Restaurant,
  ): Restaurant {
    return this.restaurantsService.updateOne(name, updatedRestaurant);
  }

  @Delete(':name')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant successfully deleted.',
  })
  deleteRestaurant(@Param('name') name: string): { response: string } {
    this.restaurantsService.deleteOne(name);
    return { response: 'Restaurant deleted' };
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    return Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2);
  }
}
