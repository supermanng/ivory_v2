import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class RestaurantsModule {}
