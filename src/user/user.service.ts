import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInDays } from 'date-fns';
import { assign } from 'lodash';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getProfileByUsername(username: string) {
    const user = await this.findByUsername(username, true);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  async getProfile(id: string) {
    const user = await this.findOne(id);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  async getBalance(id: string) {
    const user = await this.findOne(id);

    return user.balance;
  }

  async getUsers(page: number, limit: number) {
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

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findOne(id);

    assign(user, updateProfileDto);

    await this.userRepository.save(user);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  async findOne(id: string, withResponse?: boolean) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['balance'],
    });

    if (withResponse && !user) throw new NotFoundException('user not found');

    return user;
  }

  async findByUsername(username: string, withResponse?: boolean) {
    const user = await this.userRepository.findOneBy({ username });

    if (withResponse && !user) throw new NotFoundException('user not found');

    return user;
  }

  async deactivateUser(authId: string) {
    const user = await this.findOne(authId);

    if (user.is_deactivated)
      throw new BadRequestException('Account already deactivated');

    user.is_deactivated = true;
    user.deactivated_at = new Date().toISOString();

    await this.userRepository.save(user);

    delete user.password;
    delete user.password_changed_at;

    return user;
  }

  async activateUser(authId: string) {
    const user = await this.findOne(authId);

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
