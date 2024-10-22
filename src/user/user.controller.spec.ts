import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { Gender } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getProfile: jest.fn().mockImplementation((user_id) => {
      return Promise.resolve(users[0]);
    }),
    getUser: jest.fn().mockImplementation((user_id) => {
      return Promise.resolve(users[0]);
    }),
    getProfileByUsername: jest.fn().mockImplementation((username) => {
      return Promise.resolve(userWithoutBalance);
    }),
    getBalance: jest.fn().mockImplementation((user_id) => {
      return Promise.resolve(balance);
    }),
    getUsers: jest.fn().mockImplementation((page: number, limit: number) => {
      return Promise.resolve(users);
    }),
    updateProfile: jest.fn().mockImplementation((dto) => {
      return {
        ...users[1],
        ...dto,
      };
    }),
  };

  const mockAuthService = {};
  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a user by ID', async () => {
    expect(await controller.getUser('1')).toEqual(users[0]);

    expect(mockUserService.getProfile).toHaveBeenCalledWith('1');
  });

  it('should get a user by username', async () => {
    expect(await controller.getUserByUsername('ebukadoe4')).toEqual({
      firstname: 'Ebuka',
      gender: 'male',
      id: '1',
      lastname: 'Doe',
      username: 'ebukadoe3',
    });

    expect(mockUserService.getProfileByUsername).toHaveBeenCalledWith(
      'ebukadoe4',
    );
  });

  it('should get authenticated user', async () => {
    expect(await controller.getProfile({ user: { id: '1' } } as any)).toEqual(
      users[0],
    );

    expect(mockUserService.getProfile).toHaveBeenCalledWith('1');
  });

  it('should get authenticated user balance', async () => {
    expect(await controller.getBalance({ user: { id: '1' } } as any)).toEqual({
      id: '1',
      created_at: '2024-10-22T01:23:23.762Z',
      updated_at: '2024-10-22T01:36:23.250Z',
      amount: '200.00',
    });

    expect(mockUserService.getBalance).toHaveBeenCalledWith('1');
  });
});

const userWithoutBalance = {
  id: '1',
  firstname: 'Ebuka',
  lastname: 'Doe',
  username: 'ebukadoe3',
  gender: Gender.MALE,
};

const balance = {
  id: '1',
  created_at: '2024-10-22T01:23:23.762Z',
  updated_at: '2024-10-22T01:36:23.250Z',
  amount: '200.00',
};

const users = [
  {
    // id: 'aa167675-f394-46e0-8864-f8b0546fd5ea',
    id: '1',
    firstname: 'Ebuka',
    lastname: 'Doe',
    username: 'ebukadoe3',
    gender: Gender.MALE,
    balance: {
      // id: '78a7033a-8282-4d18-be92-d66ea64efb84',
      id: '1',
      created_at: '2024-10-22T01:23:23.762Z',
      updated_at: '2024-10-22T01:36:23.250Z',
      amount: '200.00',
    },
  },
  {
    // id: 'b2380b17-9cd7-4e3a-ab59-cae8050cd1b7',
    id: '2',
    firstname: 'Ebuka',
    lastname: 'Doe',
    username: 'ebukadoe4',
    gender: Gender.MALE,
    balance: {
      // id: '78a7033a-8282-4d18-be92-d66ea64efb84',
      id: '2',
      created_at: '2024-10-22T01:23:23.762Z',
      updated_at: '2024-10-22T01:36:23.250Z',
      amount: '400.00',
    },
  },
];
