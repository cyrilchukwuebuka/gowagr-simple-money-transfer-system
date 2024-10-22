import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInDays } from 'date-fns';
import { assign } from 'lodash';
import { Balance } from 'src/balance/entities/balance.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { BalanceService } from 'src/balance/balance.service';

/**
 * Represents a service for handling users in the system.
 * @class
 *
 * @field userRepository
 *
 * @method getProfileByUsername
 * @method getProfile
 * @method getBalance
 * @method getUsers
 * @method updateProfile
 * @method findOne
 * @method findByUsername
 * @method deactivateUser
 * @method activateUser
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of UserService.
   * @param {Repository<User>} userRepository - The repository for accessing user data.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // private readonly balanceService: BalanceService
  ) {}

  /**
   * Gets a user without balance detail by username.
   * @method
   *
   * @param {string} username - The user's username.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given username is not found.
   */
  async getProfileByUsername(username: string): Promise<User> {
    const user = await this.findByUsername(username, true);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  /**
   * Gets a user with balance detail by ID.
   * @method
   *
   * @param {string} id - The user's ID.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async getProfile(id: string): Promise<User> {
    const user = await this.findOne(id);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  /**
   * Gets a user balance by user ID.
   * @method
   *
   * @param {string} user_id - The user's ID.
   * @returns {Promise<Balance>} A promise that resolves when balance is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async getBalance(user_id: string): Promise<any> {
    // return await this.balanceService.getUserBalance(user_id)
  }

  /**
   * Gets users.
   * @method
   *
   * @param {number} page - The page in view.
   * @param {number} limit - The limit of items per view.
   * @returns {Promise<[User[], number]>} A promise that resolves when users are found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async getUsers(page: number, limit: number): Promise<[User[], number]> {
    const offset = (page - 1) * limit;
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.balance', 'balance')
      .select([
        'user.id',
        'user.firstname',
        'user.lastname',
        'user.username',
        'user.gender',
        'balance.amount',
      ])
      .skip(offset)
      .take(limit)
      .getManyAndCount();
  }

  /**
   * Updates a user profile by ID.
   * @method
   *
   * @param {string} id - The user's ID.
   * @param {UpdateProfileDto} updateProfileDto - The user's update detail.
   * @param {string} updateProfileDto.firstname - The firstname of the user.
   * @param {string} updateProfileDto.lastname - The lastname of the user.
   * @param {string} updateProfileDto.username - The username of the user.
   * @param {string} updateProfileDto.country - The country of the user.
   *
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    assign(user, updateProfileDto);

    await this.userRepository.save(user);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  /**
   * Gets a user with balance detail by ID.
   * @method
   *
   * @param {string} id - The user's ID.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async findOne(id: string, withResponse?: boolean): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['balance'],
    });

    if (withResponse && !user) throw new NotFoundException('User not found');

    return user;
  }

  /**
   * Gets a user without balance detail by username.
   * @method
   *
   * @param {string} username - The user's username.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given username is not found.
   */
  async findByUsername(
    username: string,
    withResponse?: boolean,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (withResponse && !user) throw new NotFoundException('User not found');

    return user;
  }

  /**
   * Deactivates a user by user ID.
   * @method
   *
   * @param {string} user_id - The user's user ID.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   * @throws {BadRequestException} If the user is already deactivated.
   */
  async deactivateUser(user_id: string): Promise<User> {
    const user = await this.findOne(user_id);

    if (user.is_deactivated)
      throw new BadRequestException('Account already deactivated');

    user.is_deactivated = true;
    user.deactivated_at = new Date().toISOString();

    await this.userRepository.save(user);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  /**
   * Activates a user by user ID.
   * @method
   *
   * @param {string} user_id - The user's user ID.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   * @throws {BadRequestException} If the user is already activated or has not reached a 30 days reactivation duration.
   */
  async activateUser(user_id: string): Promise<User> {
    const user = await this.findOne(user_id);

    if (!user.is_deactivated)
      throw new BadRequestException('Your account is already active');

    const diff = differenceInDays(new Date(user.deactivated_at), new Date());

    if (diff < 30)
      throw new BadRequestException(
        `Your account cannot be activated until ${30 - diff} day(s)`,
      );

    user.is_deactivated = false;
    user.deactivated_at = null;

    await this.userRepository.save(user);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }
}
