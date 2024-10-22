import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Gender, User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Balance } from 'src/balance/entities/balance.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    hashPassword: jest.fn().mockImplementation((dto) => JSON.stringify(dto)),
    save: jest.fn().mockImplementation((dto) => dto),
    findOneBy: jest.fn().mockImplementation(({ id: string }) => {
      return userWithoutBalance;
    }),
    findOne: jest.fn().mockImplementation(({ id: string }) => {
      return users[0];
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
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Balance),
          useValue: mockBalanceRepository,
        },
        {
          provide: AuthService,
          useValue: {},
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a user by username', async () => {
    expect(await service.getProfileByUsername('ebukadoe3')).toEqual(
      userWithoutBalance,
    );

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      username: 'ebukadoe3',
    });
  });

  it('should get a user by ID', async () => {
    expect(await service.getProfile('1')).toEqual(users[0]);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['balance'],
    });
  });

  it('should find a user by username', async () => {
    expect(await service.findByUsername('ebukadoe3', false)).toEqual(
      userWithoutBalance,
    );

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      username: 'ebukadoe3',
    });
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
