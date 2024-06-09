import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credential } from './auth.entity';
import { CredentialsDto } from './credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateUserPasword, hashPassword } from 'src/utils/bcrypt.utils';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
  ) {}

  /**
   * Sign in a user with provided credentials.
   *
   * @param {CredentialsDto} credentials - The credentials used for authentication.
   * @returns {Promise<string>} - A promise that resolves to the credential ID upon successful sign-in.
   * @throws {UnauthorizedException} - If the provided email or password is invalid.
   */
  async signIn(credentials: CredentialsDto) {
    const { email, password } = credentials;

    // Fetch the credential using the provided email
    const credential = await this.credentialRepository
      .createQueryBuilder('credential')
      .select(['credential.id', 'credential.password'])
      .where('credential.email = :email', { email })
      .getOne();

    // If the credential doesn't exist, throw an error
    if (!credential) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await validateUserPasword(
      password,
      credential.password,
    );
    console.log('password:', password);
    console.log('ispasswordvalid:', isPasswordValid);

    // If the password is invalid, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password from validate pasword',
      );
    }

    // Return the credential ID if everything is valid
    console.log('credential at repo', credential);
    return credential.id;
  }

  /**
   * Create a new credential with provided email and hashed password.
   *
   * @param {string} email - The email for the new credential.
   * @param {string} password - The hashed password for the new credential.
   * @returns {Promise<Credential>} - A promise that resolves to the created credential entity.
   */
  async createCredential(email: string, password: string): Promise<Credential> {
    const hasedPassword = await hashPassword(password);
    const newCredential = new Credential();
    newCredential.email = email;
    newCredential.password = hasedPassword;
    await this.credentialRepository.create(newCredential);
    return newCredential;
  }
}
