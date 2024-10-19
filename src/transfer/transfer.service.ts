import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { PAYMENT_STATUS, Transfer } from './entities/transfer.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(User)
    private readonly transferRepository: Repository<Transfer>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async create(user_id: string, createTransferDto: CreateTransferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let transfer: Transfer;

    try {
      const { receiverId, amount, description } = createTransferDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (amount < 1) {
        throw new NotAcceptableException(
          'Amount must be greater than zero (0)',
        );
      }

      // user check done in userService class
      const sender = await this.userService.findOne(user_id);
      const receiver = await this.userService.findOne(receiverId);

      if (sender.balance.amount < amount) {
        throw new BadRequestException('Amount must be less than your balance');
      }

      sender.balance.amount = sender.balance.amount - amount;
      receiver.balance.amount = receiver.balance.amount + amount;

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
      // throw new
    } finally {
      await queryRunner.release();
    }

    return transfer
  }

  async findAll(user_id: string, query: PaginateQuery) {
    const queryBuilder = this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoin('transfer.sender', 'sender')
      .leftJoin('transfer.receiver', 'receiver')
      .where('sender.id = :senderId', { senderId: user_id })
      .andWhere('receiver.id = :receiverId', { receiverId: user_id });

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
        'receiver.firstname': [FilterOperator.CONTAINS],
        'receiver.lastname': [FilterOperator.CONTAINS],
        description: [FilterOperator.CONTAINS],
      },
    });
  }

  async findOne(user_id: string, transfer_id: string) {
    const transfer = await this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoin('transfer.sender', 'sender')
      .leftJoin('transfer.receiver', 'receiver')
      .where('transfer.id = :id', { id: transfer_id })
      .andWhere('sender.id = :senderId', { senderId: user_id })
      .andWhere('receiver.id = :receiverId', { receiverId: user_id })
      .getOne();

    if (!transfer) throw new NotFoundException('Transfer not found');

    return transfer;
  }
}
