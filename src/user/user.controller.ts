import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService, ReqUser } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { users } from 'src/utils/routes';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Balance } from 'src/transfer/entities/balance.entity';

/**
 * Represents a controller for handling users in the system.
 * @class
 *
 * @field userService
 * @field authService
 *
 * @method getUser
 * @method findAll
 * @method findOne
 */
@Controller(users)
@UseGuards(JwtAuthGuard)
export class UserController {
  /**
   * Creates an instance of TransferController.
   * @param {UserService} userService - The service for accessing user functionalities.
   * @param {AuthService} authService - The service for accessing auth functionalities.
   */
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Gets a user with balance detail by ID.
   * @method
   *
   * @param {string} userId - The user's ID.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<User> {
    return await this.userService.getProfile(userId);
  }

  /**
   * Gets a user without balance detail by username.
   * @method
   *
   * @param {string} username - The user's username.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return await this.userService.getProfileByUsername(username);
  }

  /**
   * Gets users.
   * @method
   *
   * @param {number} page - The page in view.
   * @param {number} limit - The limit of items per view.
   * @returns {Promise<[User[], number]>} A promise that resolves when users are found.
   */
  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<[User[], number]> {
    return await this.userService.getUsers(page, limit);
  }

  /**
   * creates a new user profile.
   * @method
   *
   * @param {CreateUserDto} createUserDto - The user's create detail.
   * @param {string} createUserDto.firstname - The firstname of the user.
   * @param {string} createUserDto.lastname - The lastname of the user.
   * @param {string} createUserDto.password - The password of the user.
   * @param {Gender} createUserDto.gender - The gender of the user.
   * @param {string} createUserDto.username - The username of the user.
   * @param {string} createUserDto.country - The country of the user.
   *
   * @returns {Promise<{access_token: string;is_deactivated: boolean;deactivated_at: string;}>} A promise that resolves when the user is found.
   */
  @Post()
  @HttpCode(201)
  @Public()
  create(@Body() createUserDto: CreateUserDto): Promise<{
    access_token: string;
    is_deactivated: boolean;
    deactivated_at: string;
  }> {
    return this.authService.signup(createUserDto);
  }

  /**
   * Updates a user profile by ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @param {UpdateProfileDto} updateProfileDto - The user's update detail.
   * @param {string} updateProfileDto.firstname - The firstname of the user.
   * @param {string} updateProfileDto.lastname - The lastname of the user.
   * @param {string} updateProfileDto.username - The username of the user.
   * @param {string} updateProfileDto.country - The country of the user.
   *
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @Put()
  async updateProfile(
    @Req() req: Request & ReqUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return await this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  /**
   * Gets a user with balance detail by ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @Get('/profile')
  async getProfile(@Req() req: Request & ReqUser): Promise<User> {
    return await this.userService.getProfile(req.user.id);
  }

  /**
   * Gets a user balance by user ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<Balance>} A promise that resolves when balance is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  @Get('/balance')
  async getBalance(@Req() req: Request & ReqUser): Promise<Balance> {
    return this.userService.getBalance(req.user.id);
  }

  /**
   * Deactivates a user by user ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @Patch('/deactivate')
  async deactivateUser(@Req() req: Request & ReqUser): Promise<User> {
    return await this.userService.deactivateUser(req.user.id);
  }

  /**
   * Activates a user by user ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @Patch('/activate')
  async activateUser(@Req() req: Request & ReqUser): Promise<User> {
    return await this.userService.activateUser(req.user.id);
  }
}
