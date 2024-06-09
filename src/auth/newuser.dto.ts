import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { Role } from 'src/common/enums';
import { MatchFieldsConstraint } from 'src/common/validation/validation.matchFields';

export class NewUserDto {
  @ApiProperty({
    description: "User's email address",
    example: 'bartolomiau@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's name",
    example: 'Bartolomiau',
  })
  @IsString()
  @Length(3, 80)
  name: string;

  @ApiProperty({
    description: "User's address",
    example: '123 Miaw St, Catcity',
  })
  @IsString()
  @Length(3, 80)
  address: string;

  @ApiProperty({
    description:
      "User's phone number. Must be a valid US phone number with the international calling code",
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

  @ApiProperty({
    description:
      "User's password. Must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
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
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one symbol',
    },
  )
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(15, { message: 'Password must be at mouts 15 characters long' })
  password: string;

  @ApiProperty({
    description: "User's confirm password. Must match the password field.",
    example: 'Miaussword123!',
  })
  @IsString()
  @Validate(MatchFieldsConstraint, ['password'], {
    message: 'Passwords must match',
  })
  confirmPassword: string;

  @ApiProperty({
    description: "User's role",
    example: Role.User,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
