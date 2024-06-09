import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { NewUserDto } from 'src/auth/newuser.dto';
import { Credential } from 'src/auth/auth.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Role } from 'src/common/enums';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Retrieve all users with pagination.
   * @param pagination - Object containing page and limit for pagination.
   * @returns A paginated list of users.
   */
  async getAllUsers(pagination: { page: number; limit: number }) {
    return await this.userRepository.findAll(pagination);
  }

  /**
   * Create a new user.
   * @param credential - The credentials of the new user.
   * @param userData - The data for the new user.
   * @returns The created user.
   */
  async createUser(credential: Credential, userData: NewUserDto) {
    try {
      return await this.userRepository.create(credential, userData);
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail;
        if (detail.includes('email')) {
          throw new ConflictException('User with this email already exists.');
        } else if (detail.includes('phone')) {
          throw new ConflictException(
            'User with this phone number already exists.',
          );
        }
      }
      throw new InternalServerErrorException('Fail to register new user');
    }
  }

  /**
   * Update a user by ID.
   * @param id - The ID of the user to update.
   * @param update - The data to update the user with.
   * @returns The updated user.
   * @throws NotFoundException if the user does not exist.
   */
  async updateUser(id: string, update: UserDto) {
    await this.getUserById(id);
    return await this.userRepository.update(id, update);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns The deleted user.
   * @throws InternalServerErrorException if the user deletion fails.
   */
  async deleteUser(id: string): Promise<User> {
    const user = await this.getUserById(id);
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Fail to delete user with ID ${id}`,
      );
    }
    return user;
  }

  /**
   * Retrieve a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the given ID.
   * @throws NotFoundException if the user is not found.
   * @throws InternalServerErrorException for other errors.
   */
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(id);

      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to retrieve user');
      }
    }
  }

  /**
   * Retrieve a user by credential ID.
   * @param credentialId - The credential ID of the user to retrieve.
   * @returns The user with the given credential ID.
   * @throws NotFoundException if the user is not found.
   * @throws InternalServerErrorException for other errors.
   */
  async getUserByCredentialId(credentialId: number): Promise<User> {
    try {
      return await this.userRepository.findByCredentialsId(credentialId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to retrive User');
      }
    }
  }

  async upgradeRol(id: string) {
    try {
      const user = await this.getUserById(id);
      user.role = Role.Admin;
      await this.userRepository.upgrateRol(user);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to upgrade user role to admin',
      );
    }
  }
}
