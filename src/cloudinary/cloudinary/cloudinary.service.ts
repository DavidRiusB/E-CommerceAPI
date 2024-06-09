import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable() // Marks this class as a provider that can be injected into other parts of the application
export class CloudinaryService {
  // Constructor with dependency injection
  constructor(@Inject('Cloudinary') private cloudinary) {}

  // Method to upload an image to Cloudinary
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    // Returning a promise to handle asynchronous upload
    return new Promise((resolve, reject) => {
      // Creating an upload stream with Cloudinary's uploader.upload_stream method
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Setting the resource type to auto to allow Cloudinary to detect the file type automatically
        (error, result) => {
          if (error) reject(error); // If there's an error, reject the promise
          resolve(result); // If successful, resolve the promise with the result
        },
      );

      // Creating a readable stream from the file buffer and piping it to the upload stream
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
