import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({
    description: "User's email address",
    example: 'bartolomiau@example.com',
  })
  @IsEmail({}, { message: 'Invalid email or password' })
  email: string;

  @ApiProperty({
    description: "User's password. Must be between 8 and 15 characters long.",
    example: 'Miaussword123!',
  })
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Invalid email or password',
    },
  )
  @MinLength(8, { message: 'Invalid email or password' })
  @MaxLength(15, { message: 'Invalid email or password' })
  password: string;
}
