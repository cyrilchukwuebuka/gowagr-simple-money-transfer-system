import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Gender } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './type/auth.type';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockImplementation(async (dto) => {
      return await Promise.resolve({
        access_token: 'just_a_token',
        deactivated_at: null,
        is_deactivated: false,
      });
    }),
    changePassword: jest.fn(),
    // service
    signup: jest.fn().mockImplementation((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should create a user', async () => {
  //   const user: CreateUserDto = {
  //     country: 'Nigeria',
  //     firstname: 'John',
  //     gender: Gender.MALE,
  //     lastname: 'Smith',
  //     password: 'password',
  //     username: 'johnsmith',
  //   };

  //   expect(await controller.create(user)).toEqual({
  //     id: expect.any(Number),
  //     ...user,
  //   });

  //   expect(mockAuthService.signup).toHaveBeenCalledWith(user);
  // });

  // it('should log in a user', async () => {
  //   const credential: LoginDto = {
  //     password: 'password',
  //     username: 'johnsmith',
  //   };

  //   expect(await controller.login(credential)).toEqual({
  //     access_token: 'just_a_token',
  //     deactivated_at: null,
  //     is_deactivated: false,
  //   });

  //   expect(mockAuthService.login).toHaveBeenCalledWith(credential);
  // });
});
