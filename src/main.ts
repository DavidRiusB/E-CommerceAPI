import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RouteLoggingMiddleware } from './common';
import { GlobalValidationPipe } from './common/validation';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API Documentation')
    .setDescription(
      'This API handles operations related to an e-commerce platform, including user authentication, product management, order processing, and more.',
    )
    .setVersion('1.0')
    .addTag(
      'auth',
      'Endpoints related to user authentication and authorization',
    )
    .addTag('users', 'Endpoints related to user management')
    .addTag('orders', 'Endpoints related to order processing and management')
    .addTag('order details', 'Endpoints related to order detail management')
    .addTag('products', 'Endpoints related to product management')
    .addTag('categories', 'Endpoints related to category management')
    .addTag('carts', 'Endpoints related to shopping cart management')
    .addTag('cart items', 'Endpoints related to shopping cart item management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(GlobalValidationPipe);
  app.use(RouteLoggingMiddleware);
  await app.listen(3000);
}
bootstrap();
