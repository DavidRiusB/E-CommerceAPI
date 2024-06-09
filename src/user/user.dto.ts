import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'bartolomiaw@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Name of the user',
    minLength: 4,
    maxLength: 50,
    example: 'Bartolomiaw',
  })
  @IsString()
  @Length(4, 50)
  name: string;

  @ApiProperty({
    description: 'Address of the user',
    minLength: 1,
    maxLength: 50,
    example: '123 Miaw St, Catcity',
  })
  @IsString()
  @Length(1, 50)
  address: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1-770-212-6011',
  })
  @IsPhoneNumber('US')
  phone: string;

  @ApiProperty({
    description: "User's country, must be at least 5 chars long",
    example: 'Catland',
    required: false,
  })
  @IsString()
  @Length(5, 20)
  country?: string | null;

  @ApiProperty({
    description: "User's city",
    example: 'Catland',
    required: false,
  })
  @IsString()
  @Length(5, 20)
  city?: string | null;
}
