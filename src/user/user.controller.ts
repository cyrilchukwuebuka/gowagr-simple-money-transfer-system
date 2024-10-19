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

@Controller(users)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return await this.userService.getProfile(userId);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.userService.getProfileByUsername(username);
  }

  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.userService.getUsers(page, limit);
  }

  @Post()
  @HttpCode(201)
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Put()
  async updateProfile(
    @Req() req: Request & ReqUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('/profile')
  async getProfile(@Req() req: Request & ReqUser) {
    return await this.userService.getProfile(req.user.id);
  }

  @Get('/balance')
  async getBalance(@Req() req: Request & ReqUser) {
    return this.userService.getBalance(req.user.id);
  }

  @Patch('/deactivate')
  async deactivateUser(@Req() req: Request & ReqUser) {
    return await this.userService.deactivateUser(req.user.id);
  }

  @Patch('/activate')
  async activateUser(@Req() req: Request & ReqUser) {
    return await this.userService.activateUser(req.user.id);
  }
}
