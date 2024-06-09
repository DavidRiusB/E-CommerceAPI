import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CredentialsDto } from './credential.dto';
import { UserService } from 'src/user/user.service';
import { NewUserDto } from './newuser.dto';
import { DataSource } from 'typeorm';
import { User } from 'src/user/user.entity';
import { loadData } from 'src/utils';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.userSeeder();
  }

  /**
   * Seed users from a JSON file if the database contains no users.
   *
   * @returns {Promise<{ message: string }>} - A message indicating the seeding result.
   */
  async userSeeder() {
    try {
      const { data, total } = await this.userService.getAllUsers({
        page: 1,
        limit: 5,
      });

      if (data.length === 0) {
        const data = loadData<any[]>('userData.json');
        for (const userData of data) {
          await this.register(userData);
        }
        console.log({ message: 'Users seeded successfully' });
        return { message: 'Users seeded successfully' };
      }
      console.log('DB contains users');
      return { message: 'DB contains users' };
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  }

  async token(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.sign(payload);
    return accessToken;
  }

  /**
   * Generate JWT token for a user.
   *
   * @param {User} user - The user for whom the token is generated.
   * @returns {Promise<string>} - A promise that resolves to the generated JWT token.
   */
  async signIn(credentials: CredentialsDto) {
    try {
      const credentialsId = await this.authRepository.signIn(credentials);
      console.log('credential id on service after fecth: ', credentialsId);

      if (!credentialsId) {
        throw new BadRequestException('Invalid email or password');
      }

      const user = await this.userService.getUserByCredentialId(credentialsId);

      const token = await this.token(user);

      return { token, user };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        throw new InternalServerErrorException('Fail to login user');
      }
    }
  }

  /**
   * Sign in a user with provided credentials.
   *
   * @param {CredentialsDto} credentials - The credentials used for authentication.
   * @returns {Promise<{ token: string, user: User }>} - A promise that resolves to the JWT token and user details upon successful sign-in.
   */
  async register(newUserData: NewUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { email, password } = newUserData;

      try {
        // Create and save the credential
        const credential = await this.authRepository.createCredential(
          email,
          password,
        );
        await manager.save(credential);
        // Create and save the user, associating it with the created credential
        const user = await this.userService.createUser(credential, newUserData);

        await manager.save(user);

        const token = await this.token(user);

        return { user, token };
      } catch (error) {
        if (error instanceof ConflictException) throw error;

        if (error.code === '23505') {
          const detail = error.detail;
          if (detail.includes('email')) {
            throw new ConflictException('Email alredy register');
          }
        }

        throw new InternalServerErrorException('Fail to register new user');
      }
    });
  }
}
