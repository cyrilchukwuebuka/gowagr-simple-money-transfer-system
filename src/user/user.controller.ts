import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService, ReqUser } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Balance } from 'src/balance/entities/balance.entity';
import { users } from 'src/utils/routes';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { BalanceService } from 'src/balance/balance.service';

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
@ApiTags('users')
@Controller(users)
@UseGuards(JwtAuthGuard)
export class UserController {
  /**
   * Creates an instance of TransferController.
   * @param {UserService} userService - The service for accessing user functionalities.
   * @param {AuthService} authService - The service for accessing auth functionalities.
   * @param {BalanceService} authService - The service for accessing balance functionalities.
   */
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly balanceService: BalanceService,
  ) {}

  /**
   * Gets a user with balance detail by ID.
   * @method
   *
   * @param {string} userId - The user's ID.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a user with balance detail by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user information',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get('/:id/profile')
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a user without balance detail by username.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user information',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided username.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get('/username')
  async getUserByUsername(@Query('username') username: string): Promise<User> {
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets users without balance detail.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved users information',
    schema: {
      properties: {
        data: {
          type: 'array',
          // items: { $ref: '#/components/schemas/UserDto' },
        },
        meta: {
          type: 'object',
          properties: {
            totalCount: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<[User[], number]> {
    return await this.userService.getUsers(page, limit);
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets an authenticated user and update user detail.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user information',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Put()
  async updateProfile(
    @Req() req: Request & ReqUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return await this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  /**
   * Gets authenticated user with balance detail by ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a user with balance detail by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user information',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a user balance by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user balance.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get('/balance') 
  async getBalance(@Req() req: Request & ReqUser): Promise<Balance> {
    // return this.userService.getBalance(req.user.id);
    return await this.balanceService.getUserBalance(req.user.id);
  }

  /**
   * Deactivates a user.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a logged in user and deactivates the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deactivated user',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Patch('/deactivate')
  async deactivateUser(@Req() req: Request & ReqUser): Promise<User> {
    return await this.userService.deactivateUser(req.user.id);
  }

  /**
   * Activates a user.
   * @method
   *
   * @param {Object} req - The request object.
   * @returns {Promise<User>} A promise that resolves when the user is found.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a logged in user and activates the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully activated user',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Patch('/activate')
  async activateUser(@Req() req: Request & ReqUser): Promise<User> {
    return await this.userService.activateUser(req.user.id);
  }
}
