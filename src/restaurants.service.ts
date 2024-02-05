import { Injectable } from '@nestjs/common';
import { Restaurant } from './restaurants.interface';

@Injectable()
export class RestaurantsService {
  private restaurants: Restaurant[] = [
    {
      name: 'Cafe Delight',
      address: '123 Main St, New York, NY',
      latitude: 40.7112,
      longitude: -74.0055,
      cuisine: 'American',
      priceRange: '$$',
      rating: 4.5,
    },
    {
      name: 'Pasta Paradise',
      address: '456 Elm St, New York, NY',
      latitude: 40.7145,
      longitude: -74.0082,
      cuisine: 'Italian',
      priceRange: '$$$',
      rating: 4.2,
    },
  ];

  findAll(): Restaurant[] {
    console.log(this.restaurants);
    return this.restaurants;
  }

  findOneByName(name: string): Restaurant {
    return this.restaurants.find(
      (restaurant) => restaurant.name.toLowerCase() === name.toLowerCase(),
    );
  }

  addOne(restaurant: Restaurant): Restaurant {
    this.restaurants.push(restaurant);
    return restaurant;
  }

  updateOne(name: string, updatedRestaurant: Restaurant): Restaurant {
    const index = this.restaurants.findIndex(
      (restaurant) => restaurant.name.toLowerCase() === name.toLowerCase(),
    );
    if (index !== -1) {
      this.restaurants[index] = updatedRestaurant;
      return updatedRestaurant;
    }
    return null;
  }

  deleteOne(name: string): void {
    this.restaurants = this.restaurants.filter(
      (restaurant) => restaurant.name.toLowerCase() !== name.toLowerCase(),
    );
  }
}
