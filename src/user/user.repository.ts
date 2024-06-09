import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUserDto } from 'src/auth/newuser.dto';
import { Credential } from 'src/auth/auth.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find a user by their credential ID.
   * @param credentialId - The credential ID of the user to find.
   * @returns The user with the given credential ID.
   * @throws NotFoundException if the user is not found.
   */
  async findByCredentialsId(credentialId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.credential', 'credential')
      .where('credential.id = :credentialId', { credentialId })
      .getOne();

    if (!user) {
      throw new NotFoundException(
        `User with credential ID ${credentialId} not found`,
      );
    }
    return user;
  }

  /**
   * Retrieve all users with pagination.
   * @param pagination - Object containing page and limit for pagination.
   * @returns An object containing the users data and total count.
   */
  async findAll(pagination: {
    page: number;
    limit: number;
  }): Promise<{ data: User[]; total: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { data, total };
  }

  /**
   * Create a new user.
   * @param credential - The credentials of the new user.
   * @param user - The data for the new user.
   * @returns The created user.
   */
  async create(credential: Credential, user: NewUserDto): Promise<User> {
    const { email, name, address, phone, country, city, role } = user;
    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.credential = credential;
    newUser.address = address;
    newUser.phone = phone;
    newUser.country = country;
    newUser.city = city;
    newUser.role = role;
    await this.userRepository.create(newUser);
    return newUser;
  }

  /**
   * Find a user by their ID.
   * @param id - The ID of the user to find.
   * @returns The user with the given ID.
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
    console.log('user:(what return if not found)', user);
    return user;
  }
  /**
   * Update a user by ID.
   * @param id - The ID of the user to update.
   * @param user - The data to update the user with.
   * @returns The updated user.
   * @throws InternalServerErrorException if the user update fails.
   * @throws ConflictException if the update causes a conflict (e.g., duplicate email).
   */
  async update(id: string, user: UserDto): Promise<User> {
    try {
      const updateResult = await this.userRepository.update(id, user);

      if (updateResult.affected === 0)
        throw new InternalServerErrorException(
          `Failed to update user with ID ${id}`,
        );

      const updatedUser = await this.findOneById(id);
      return updatedUser;
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new ConflictException('Email already exists');
        }
      }
    }
    throw new InternalServerErrorException('Failed to update user');
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns The result of the soft delete operation.
   */
  async delete(id: string) {
    const result = await this.userRepository.softDelete(id);
    return result;
  }

  async upgrateRol(user: User) {
    await this.userRepository.save(user);
  }
}
