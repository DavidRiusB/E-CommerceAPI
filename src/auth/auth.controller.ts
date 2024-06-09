import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './credential.dto';
import { NewUserDto } from './newuser.dto';
import { RemovePropertiesInterceptor } from 'src/common/interceptor/remove-properties.interceptor';
import { Response, response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint to sign in a user with provided credentials.
   *
   * @param {CredentialsDto} credentials - The credentials used for authentication.
   * @param {Response} response - Express response object for setting headers.
   * @returns {Promise<{ user: User, token: string }>} - A promise that resolves to user and token upon successful sign-in.
   */
  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user with provided credentials' })
  @ApiResponse({
    status: 200,
    description: 'User signed in and JWT token',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @UseInterceptors(
    new RemovePropertiesInterceptor(['credential', 'deletedAt', 'rol']),
  )
  async signIn(
    @Body() credentials: CredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user } = await this.authService.signIn(credentials);
    response.header('authorization', `Bearer ${token}`);

    return { user, token };
  }

  /**
   * Endpoint to register a new user.
   *
   * @param {NewUserDto} newUserData - The data for creating a new user.
   * @param {Response} response - Express response object for setting headers.
   * @returns {Promise<User>} - A promise that resolves to the created user.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered and JWT token.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists.',
  })
  @UseInterceptors(
    new RemovePropertiesInterceptor(['credential', 'deletedAt', 'rol']),
  )
  async register(
    @Body() newUserData: NewUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user } = await this.authService.register(newUserData);
    response.header('authorization', `Bearer ${token}`);

    return { user, token };
  }
}
