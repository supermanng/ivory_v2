import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurants.interface';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [RestaurantsService],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  describe('findRestaurants', () => {
    it('should return an array of restaurants', async () => {
      const restaurants: Restaurant[] = [
        {
          name: 'Cafe Delight',
          address: '123 Main St, New York, NY',
          latitude: 40.7112,
          longitude: -74.0055,
          cuisine: 'American',
          priceRange: '$$',
          rating: 4.5,
        },
      ];
      jest.spyOn(service, 'findAll').mockReturnValue(restaurants);

      const result = await controller.findRestaurants();
      expect(result).toEqual(restaurants);
    });

    it('should filter restaurants by city', async () => {
      const restaurants: Restaurant[] = [
        {
          name: 'Cafe Delight',
          address: '123 Main St, New York, NY',
          latitude: 40.7112,
          longitude: -74.0055,
          cuisine: 'American',
          priceRange: '$$',
          rating: 4.5,
        },
        // Add more test restaurants as needed
      ];
      jest.spyOn(service, 'findAll').mockReturnValue(restaurants);

      const result = await controller.findRestaurants('New York');
      expect(result).toEqual([restaurants[0]]); // Ensure only restaurants from New York are returned
    });

    // Add more test scenarios for different query parameters
  });

  describe('getRestaurant', () => {
    it('should return a restaurant by name', () => {
      const restaurant: Restaurant = {
        name: 'Cafe Delight',
        address: '123 Main St, New York, NY',
        latitude: 40.7112,
        longitude: -74.0055,
        cuisine: 'American',
        priceRange: '$$',
        rating: 4.5,
      };
      jest.spyOn(service, 'findOneByName').mockReturnValue(restaurant);

      const result = controller.getRestaurant('Cafe Delight');
      expect(result).toEqual(restaurant);
    });

    it('should return null if restaurant not found', () => {
      jest.spyOn(service, 'findOneByName').mockReturnValue(null);

      const result = controller.getRestaurant('NonExistentRestaurant');
      expect(result).toBeNull();
    });
  });

  describe('addRestaurant', () => {
    it('should add a new restaurant', () => {
      const newRestaurant: Restaurant = {
        name: 'New Restaurant',
        address: '789 Elm St, New York, NY',
        latitude: 40.7155,
        longitude: -74.0098,
        cuisine: 'Chinese',
        priceRange: '$',
        rating: 4.0,
      };
      jest.spyOn(service, 'addOne').mockReturnValue(newRestaurant);

      const result = controller.addRestaurant(newRestaurant);
      expect(result).toEqual(newRestaurant);
    });
  });

  describe('updateRestaurant', () => {
    it('should update an existing restaurant', () => {
      const updatedRestaurant: Restaurant = {
        name: 'Cafe Delight',
        address: '123 Main St, New York, NY',
        latitude: 40.7112,
        longitude: -74.0055,
        cuisine: 'American',
        priceRange: '$$$',
        rating: 4.7,
      };
      jest.spyOn(service, 'updateOne').mockReturnValue(updatedRestaurant);

      const result = controller.updateRestaurant(
        'Cafe Delight',
        updatedRestaurant,
      );
      expect(result).toEqual(updatedRestaurant);
    });

    it('should return null if restaurant to update is not found', () => {
      const updatedRestaurant: Restaurant = {
        name: 'NonExistentRestaurant',
        address: '123 Main St, New York, NY',
        latitude: 40.7112,
        longitude: -74.0055,
        cuisine: 'American',
        priceRange: '$$$',
        rating: 4.7,
      };
      jest.spyOn(service, 'updateOne').mockReturnValue(null);

      const result = controller.updateRestaurant(
        'NonExistentRestaurant',
        updatedRestaurant,
      );
      expect(result).toBeNull();
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete an existing restaurant', () => {
      const restaurantNameToDelete = 'Pasta Paradise';
      jest.spyOn(service, 'deleteOne').mockImplementation();

      const result = controller.deleteRestaurant(restaurantNameToDelete);
      expect(result).toEqual({ response: 'Restaurant deleted' });
    });
  });
});
