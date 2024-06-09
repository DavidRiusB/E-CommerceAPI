import {
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomParseUUIDPipe } from 'src/common/validation';

@Controller('files')
export class CloudinaryController {
  constructor(private readonly fileService: CloudinaryService) {}
}
