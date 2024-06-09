import {
  BadRequestException,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ImageValidator implements PipeTransform {
  constructor(private readonly minSize: number = 10000) {} // 10KB

  async transform(image: any): Promise<any> {
    if (!image) {
      throw new BadRequestException('Image is missing');
    }

    // Use ParseFilePipe for basic file parsing and validation
    const parseFilePipe = new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileType: /(?:jpg|jpeg|png|webp|bmp)$/,

          // Corrected regex for image types
        }),
        new MaxFileSizeValidator({
          maxSize: 10485760, // 10MB
          message: 'Image must be 10MB or less',
        }),
      ],
    });

    const validatedImage = await parseFilePipe.transform(image);

    // Custom validation logic for file size
    if (validatedImage.size < this.minSize) {
      throw new BadRequestException(
        `File size should be at least ${this.minSize} bytes`,
      );
    }

    return validatedImage;
  }
}
