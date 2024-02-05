import { NestFactory } from '@nestjs/core';
import { RestaurantsModule } from './restaurants.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantsModule);

  const config = new DocumentBuilder()
    .setTitle('Resturants')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
