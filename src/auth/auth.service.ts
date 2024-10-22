import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Gender, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordResponse } from './type/auth.type';
import { Balance } from 'src/transfer/entities/balance.entity';

export type ReqUser = {
  user: { id: string };
};

/**
 * Represents a service for handling authentication in the system.
 * @class
 *
 * @field userRepository
 * @field jwtService
 * @field userService
 *
 * @method login
 * @method signup
 * @method validateCredentials
 * @method changePassword
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of UserService.
   * @param {Repository<User>} userRepository - The repository for accessing user data.
   * @param {Repository<Balance>} balanceRepository - The repository for accessing balance data.
   * @param {JwtService} jwtService - The service for accessing jwt features.
   * @param {UserService} userService - The service for accessing user features.
   * @param {DataSource} dataSource - The service for accessing database.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * logs a user into the system.
   * @method
   *
   * @param {LoginDto} loginDto - The user's create detail.
   * @param {string} loginDto.password - The password of the user.
   * @param {string} loginDto.username - The username of the user.
   *
   * @returns {Promise<{access_token: string;is_deactivated: boolean;deactivated_at: string;}>} A promise that resolves when the user is found.
   * @throws {BadRequestException} If the user credential is invalid.
   */
  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    is_deactivated: boolean;
    deactivated_at: string;
  }> {
    const { password, username } = loginDto;

    const credentials = await this.validateCredentials(username, password);

    const payload = { sub: credentials.id };

    return {
      access_token: this.jwtService.sign(payload),
      is_deactivated: credentials.is_deactivated,
      deactivated_at: credentials.deactivated_at,
    };
  }

  /**
   * creates a new user profile.
   * @method
   *
   * @param {CreateUserDto} signupDto - The user's create detail.
   * @param {string} signupDto.firstname - The firstname of the user.
   * @param {string} signupDto.lastname - The lastname of the user.
   * @param {string} signupDto.password - The password of the user.
   * @param {Gender} signupDto.gender - The gender of the user.
   * @param {string} signupDto.username - The username of the user.
   * @param {string} signupDto.country - The country of the user.
   *
   * @returns {Promise<{access_token: string;is_deactivated: boolean;deactivated_at: string;}>} A promise that resolves when the user is found.
   * @throws {BadRequestException} If the username already exists.
   */
  async signup(signupDto: CreateUserDto): Promise<{
    access_token: string;
    is_deactivated: boolean;
    deactivated_at: string;
  }> {
    const { password, firstname, lastname, country, username, gender } =
      signupDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const balance = new Balance();
      balance.amount = 0;

      const auth = await this.userService.findByUsername(username);

      if (auth)
        throw new BadRequestException(
          'This username already exist. Please login',
        );

      const newAuth = new User()
      newAuth.username = username
      newAuth.firstname = firstname
      newAuth.lastname = lastname
      newAuth.gender = gender
      newAuth.country = country
      newAuth.password = password
      newAuth.balance = balance

      await queryRunner.manager.save(newAuth);
      await queryRunner.manager.save(balance);

      await queryRunner.commitTransaction();

      const payload = { sub: newAuth.id };

      return {
        access_token: this.jwtService.sign(payload),
        is_deactivated: newAuth.is_deactivated,
        deactivated_at: newAuth.deactivated_at,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('User creation failed');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * validates user credentials.
   * @method
   *
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   *
   * @returns {Promise<{id: string;is_deactivated: boolean;deactivated_at: string;}>} A promise that resolves when the user is found.
   * @throws {BadRequestException} If the user credential is invalid.
   */
  async validateCredentials(
    username: string,
    password: string,
  ): Promise<{ id: string; is_deactivated: boolean; deactivated_at: string }> {
    const credentials = await this.userRepository.findOneBy({ username });

    if (
      credentials &&
      (await credentials.verifyPassword(password, credentials.password))
    ) {
      const { id, is_deactivated, deactivated_at } = credentials;

      return { id, is_deactivated, deactivated_at };
    } else {
      throw new BadRequestException('Invalid credentials. Please try again');
    }
  }

  /**
   * Changes user password in the system.
   * @method
   *
   * @param {string} user_id - The user's ID.
   * @param {ChangePasswordDto} changePasswordDto - The user's change password detail.
   * @param {string} changePasswordDto.current_password - The current password of the user.
   * @param {string} changePasswordDto.new_password - The new password of the user.
   *
   * @returns {Promise<ChangePasswordResponse>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user acount is not found.
   * @throws {UnauthorizedException} If the user credential is invalid.
   */
  async changePassword(
    user_id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const credentials = await this.userRepository.findOneBy({ id: user_id });

    if (!credentials) throw new NotFoundException('Account not found');

    const { current_password, new_password } = changePasswordDto;

    if (
      !(await credentials.verifyPassword(
        current_password,
        credentials.password,
      ))
    )
      throw new UnauthorizedException('Invalid current password');

    credentials.password = await credentials.hashPassword(new_password);
    credentials.password_changed_at = new Date();

    await this.userRepository.save(credentials);

    return { message: 'Password changed successfully' };
  }
}
