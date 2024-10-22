import { Body, Controller, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { auth, users } from 'src/utils/routes';
import { AuthService, ReqUser } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthResponse, ChangePasswordResponse } from './type/auth.type';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

/**
 * Represents a controller for handling authentication in the system.
 * @class
 *
 * @field authService
 *
 * @method login
 * @method create
 * @method changePassword
 */

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * logs a user into the system.
   * @method
   *
   * @param {LoginDto} loginDto - The user's create detail.
   * @param {string} loginDto.password - The password of the user.
   * @param {string} loginDto.username - The username of the user.
   *
   * @returns {Promise<{access_token: string;is_deactivated: boolean;deactivated_at: string;}>} A promise that resolves when the action is taken.
   */
  @ApiOperation({
    summary:
      'Logs a user in with username and password and returns a user access token and activation status',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in user',
    type: AuthResponse,
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
  @UseGuards(LocalAuthGuard)
  @Post(auth + '/login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
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
   * @returns {Promise<AuthResponse>} A promise that resolves when the user is found.
   */
  @ApiOperation({
    summary: 'Gets an authenticated user and update user detail.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created new user',
    type: AuthResponse,
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
  @Post(users)
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
   * Changes user password in the system.
   * @method
   *
   * @param {Object} req - The request object.
   * @param {ChangePasswordDto} changePasswordDto - The user's change password detail.
   * @param {string} changePasswordDto.current_password - The current password of the user.
   * @param {string} changePasswordDto.new_password - The new password of the user.
   *
   * @returns {Promise<ChangePasswordResponse>} A promise that resolves when action is taken.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Changes authorized user password',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully changed user password',
    type: ChangePasswordResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid current password. Please try again',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid current password. Please try again',
        error: 'Unauthorized Request',
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
  @Patch(auth + '/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: Request & ReqUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }
}
