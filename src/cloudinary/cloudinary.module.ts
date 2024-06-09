import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { ClaudinaryProvider } from 'src/config/cloudinary.config';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  imports: [ConfigModule],
  providers: [ClaudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
