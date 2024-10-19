import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { auth } from 'src/utils/routes';
import { AuthService, ReqUser } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

/**
 * Represents a controller for handling authentication in the system.
 * @class
 *
 * @field authService
 *
 * @method login
 * @method changePassword
 */
@Controller(auth)
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
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{
    access_token: string;
    is_deactivated: boolean;
    deactivated_at: string;
  }> {
    return this.authService.login(loginDto);
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
   * @returns {Promise<{message: string}>} A promise that resolves when action is taken.
   */
  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: Request & ReqUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }
}
