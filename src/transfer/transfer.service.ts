import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateQuery,
  Paginated,
  paginate
} from 'nestjs-paginate';
import { BalanceService } from 'src/balance/balance.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { DepositDto } from './dto/deposit.dto';
import { PAYMENT_STATUS, Transfer } from './entities/transfer.entity';

/**
 * Represents a service for handling transactions in the system.
 * @class
 *
 * @field transferRepository
 * @field userService
 * @field dataSource
 *
 * @method create
 * @method findAll
 * @method findOne
 */
@Injectable()
export class TransferService {
  /**
   * Creates an instance of TransferService.
   * @param {Repository<User>} transferRepository - The repository for accessing transfer data.
   * @param {UserService} userService - The service for accessing user functionalities.
   * @param {BalanceService} userService - The service for accessing balance functionalities.
   * @param {DataSource} dataSource - The service for accessing database.
   */
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a transfer object and balance amount between sender and receiver.
   * @method
   *
   * @param {string} user_id - The user's ID.
   * @param {CreateTransferDto} createTransferDto - The transfer's create detail.
   * @param {string} updateProfileDto.amount - The amount of the transaction.
   * @param {string} updateProfileDto.username - The username of the transaction.
   * @param {string} updateProfileDto.description - The description of the transaction.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   * @throws {NotAcceptableException} If the user sends an amount below digit one (1) or below the sender's current balance.
   * @throws {BadRequestException} If the transaction fails.
   */
  async create(
    user_id: string,
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    const queryRunner = this.dataSource.createQueryRunner();
    let transfer: Transfer;

    try {
      const { username, amount, description } = createTransferDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (amount < 1) {
        throw new NotAcceptableException(
          'Amount must be greater than zero (0)',
        );
      }

      // user check done in userService class
      const sender = await this.userService.findOne(user_id, true);
      const receiver = await this.userService.findByUsername(username, true);

      if (sender.balance.amount < amount) {
        throw new NotAcceptableException('Insufficient funds');
      }

      sender.balance.amount = parseFloat(sender.balance.amount + '') - amount;
      this.balanceService.updateUserBalance(user_id, sender.balance);
      receiver.balance.amount =
        parseFloat(receiver.balance.amount + '') + amount;

      transfer = new Transfer();
      transfer.amount = amount;
      transfer.description = description;
      transfer.sender = sender;
      transfer.receiver = receiver;
      transfer.status = PAYMENT_STATUS.SUCCESSFUL;

      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(receiver);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Transaction failed');
    } finally {
      await queryRunner.release();
    }

    return transfer;
  }

  /**
   * Deposits money into an authenticated user account.
   * @method
   *
   * @param {string} user_id - The user's ID.
   * @param {DepositDto} depositDto - The deposit detail.
   * @param {string} depositDto.amount - The amount of the transaction.
   * @param {string} depositDto.description - The description of the transaction.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   * @throws {NotAcceptableException} If the user sends an amount below digit one (1) or below the sender's current balance.
   * @throws {BadRequestException} If the transaction fails.
   */
  async deposit(user_id: string, depositDto: DepositDto): Promise<Transfer> {
    const queryRunner = this.dataSource.createQueryRunner();
    let transfer: Transfer;

    try {
      const { amount, description } = depositDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (amount < 1) {
        throw new NotAcceptableException(
          'Amount must be greater than zero (0)',
        );
      }

      // user check done in userService class
      const sender = await this.userService.findOne(user_id);
      sender.balance.amount = parseFloat(sender.balance.amount + '') + amount;
      this.balanceService.updateUserBalance(user_id, sender.balance);

      transfer = new Transfer();
      transfer.amount = amount;
      transfer.description = description;
      transfer.sender = sender;
      transfer.status = PAYMENT_STATUS.SUCCESSFUL;

      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(transfer);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Transaction failed');
    } finally {
      await queryRunner.release();
    }

    return transfer;
  }

  /**
   * Finds all transfers made in the system by a user.
   * @method
   *
   * @param {string} user_id - The user's ID.
   * @param {PaginateQuery} query - The transfer's create detail.
   *
   * @returns {Promise<Paginated<Transfer>>} A promise that resolves when the transfers are fetched.
   */
  async findAll(
    user_id: string,
    query: PaginateQuery,
  ): Promise<Paginated<Transfer>> {
    const queryBuilder = this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.sender', 'sender')
      .leftJoinAndSelect('transfer.receiver', 'receiver')
      .where('sender.id = :userId', { userId: user_id })
      .orWhere('receiver.id = :userId', { userId: user_id });

    return await paginate(query, queryBuilder, {
      sortableColumns: ['created_at'],
      nullSort: 'last',
      defaultSortBy: [['created_at', 'DESC']],
      searchableColumns: [
        'amount',
        'status',
        'description',
        'receiver.firstname',
        'receiver.lastname',
      ],
      filterableColumns: {
        // 'receiver.firstname': [FilterOperator.CONTAINS],
        // 'receiver.lastname': [FilterOperator.CONTAINS],
        // description: [FilterOperator.CONTAINS],
      },
    });
  }

  /**
   * Finds a transfer made in the system by a user by ID.
   * @method
   *
   * @param {string} user_id - The user's ID.
   * @param {string} transfer_id - The transfer ID.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   */
  async findOne(user_id: string, transfer_id: string): Promise<Transfer> {
    const transfer = await this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.sender', 'sender')
      .leftJoinAndSelect('transfer.receiver', 'receiver')
      .where('transfer.id = :id', { id: transfer_id })
      .getOne();
    // .andWhere('sender.id = :senderId', { senderId: user_id })
    // .andWhere('receiver.id = :username', { username: user_id })

    if (!transfer) throw new NotFoundException('Transfer not found');

    return transfer;
  }
}
