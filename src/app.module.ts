import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm';

import {
  AuthModule,
  CartModule,
  CartItemModule,
  CategoryModule,
  OrderModule,
  OrderDetailModule,
  ProductModule,
  UserModule,
} from './index';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm'),
      }),
    }),

    JwtModule.register({
      global: true,

      signOptions: { expiresIn: '60m' },
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    AuthModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderDetailModule,
    ProductModule,
    CategoryModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
