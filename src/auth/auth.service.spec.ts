import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gender, User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { Balance } from 'src/balance/entities/balance.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    hashPassword: jest.fn().mockImplementation((dto) => JSON.stringify(dto)),
    save: jest.fn().mockImplementation((dto) => dto),
    findOneBy: jest.fn().mockImplementation(({ id: string }) => {
      return users[0];
    }),
    findByUsername: jest.fn().mockImplementation((username: string) => {
      return users[1];
    }),
  };

  const mockBalanceRepository = {
    findOneBy: jest.fn().mockImplementation(({ id: string }) => {
      return {
        id: 'uu_id',
        deactivated_at: null,
        is_deactivated: false,
      };
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation((dto) => JSON.stringify(dto)),
  };

  const mockUserService = {};

  const mockDataSource = {
    createQueryRunner: jest.fn(),
    startTransaction: jest.fn(),
    manager: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Balance),
          useValue: mockBalanceRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should be log in user', async () => {
  //   const credential: LoginDto = {
  //     password: 'password',
  //     username: 'johnsmith',
  //   };

  //   expect(await service.login(credential)).toEqual({
  //     id: expect.any(String),
  //     deactivated_at: null,
  //     is_deactivated: false,
  //   });

  //   expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
  //     username: credential.username,
  //   });
  // });

  // it('should be create new user', async () => {
  //   const user: CreateUserDto = {
  //     country: 'Nigeria',
  //     firstname: 'John',
  //     gender: Gender.MALE,
  //     lastname: 'Smith',
  //     password: 'password',
  //     username: 'johnsmith',
  //   };

  //   expect(await service.signup(user)).toEqual({
  //     id: expect.any(String),
  //     deactivated_at: null,
  //     is_deactivated: false,
  //   });

  //   expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
  //   expect(mockDataSource.startTransaction).toHaveBeenCalled();
  //   expect(mockDataSource.manager).toHaveBeenCalled();
  //   expect(mockUserRepository.findByUsername).toHaveBeenCalledWith({
  //     username: user.username,
  //   });
  //   expect(mockDataSource.commitTransaction).toHaveBeenCalled();
  //   expect(mockDataSource.release).toHaveBeenCalled();
  // });
});

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
