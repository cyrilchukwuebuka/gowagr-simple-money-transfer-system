import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

export type ReqUser = {
  user: { id: string };
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    const { password, username } = loginDto;

    const credentials = await this.validateCredentials(username, password);

    const payload = { sub: credentials.id };

    return {
      access_token: this.jwtService.sign(payload),
      is_deactivated: credentials.is_deactivated,
      deactivated_at: credentials.deactivated_at,
    };
  }

  async signup(signupDto: CreateUserDto) {
    const { password, firstname, lastname, country, username, gender } =
      signupDto;

    const auth = await this.userService.findByUsername(username);

    if (auth)
      throw new BadRequestException(
        'This username already exist. Please login',
      );

    const newAuth = this.userRepository.create({
      password,
      firstname,
      lastname,
      gender,
      country,
      username,
    });

    await this.userRepository.save(newAuth);

    const payload = { sub: newAuth.id };

    return {
      access_token: this.jwtService.sign(payload),
      is_deactivated: newAuth.is_deactivated,
      deactivated_at: newAuth.deactivated_at,
    };
  }

  async validateCredentials(username: string, password: string) {
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

  async changePassword(authId: string, changePasswordDto: ChangePasswordDto) {
    const credentials = await this.userRepository.findOneBy({ id: authId });

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
