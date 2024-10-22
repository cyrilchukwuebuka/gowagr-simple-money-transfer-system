import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { Gender, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Balance } from '../balance/entities/balance.entity';
import { Transfer } from './entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { DepositDto } from './dto/deposit.dto';

describe('TransferController', () => {
  let controller: TransferController;

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

  const mockUserRepository = {
    hashPassword: jest.fn().mockImplementation((dto) => JSON.stringify(dto)),
    save: jest.fn().mockImplementation((dto) => dto),
    findOneBy: jest.fn().mockImplementation(({ id: string }) => {
      return users[0];
    }),
    findByUsername: jest.fn().mockImplementation((username: string) => {
      return userWithoutBalance;
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

  const mockTransferRepository = {
    findOneBy: jest.fn().mockImplementation(({ id: string }) => {
      return {
        id: 'uu_id',
        deactivated_at: null,
        is_deactivated: false,
      };
    }),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
    startTransaction: jest.fn(),
    manager: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  const mockTransferService = {
    create: jest.fn()((id: string, dto: CreateTransferDto) => {
      return transfer;
    }),
    deposit: jest.fn()((id: string, dto: DepositDto) => {
      return transfer;
    }),
    findAll: jest.fn()((id: string, dto: any) => {
      return transfer;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: mockTransferService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Balance),
          useValue: mockBalanceRepository,
        },
        {
          provide: getRepositoryToken(Transfer),
          useValue: mockTransferRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const transfer: CreateTransferDto = {
      amount: 100,
      receiverId: '2',
      description: 'test',
    };

    expect(
      await controller.create({ user: { id: '1' } } as any, transfer),
    ).toEqual(transfer);

    expect(mockTransferService.create).toHaveBeenCalledWith('1', transfer);
  });

  it('should deposit in user account', async () => {
    const deposit: DepositDto = {
      amount: 100,
      description: 'test',
    };

    expect(
      await controller.deposit({ user: { id: '1' } } as any, deposit),
    ).toEqual(transfer);

    expect(mockTransferService.create).toHaveBeenCalledWith('1', transfer);
  });

  // it('should get user transfers', async () => {
  //   expect(
  //     await controller.findAll(
  //       { user: { id: '1' } } as any,
  //       { page: 1, limit: 10 } as any,
  //     ),
  //   ).toEqual(transfer);

  //   expect(mockTransferService.create).toHaveBeenCalledWith('1', transfer);
  // });
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

const transfer = {
  id: 'd69b5a20-02e6-11eb-adc1-0242ac120002',
  created_at: '2024-10-04T12:34:56Z',
  updated_at: '2024-10-04T12:34:56Z',
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
