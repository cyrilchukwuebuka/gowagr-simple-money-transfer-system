import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { ReqUser } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { transfers } from 'src/utils/routes';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferService } from './transfer.service';
import { Transfer } from './entities/transfer.entity';

/**
 * Represents a controller for handling transfer in the system.
 * @class
 *
 * @field transferService
 *
 * @method create
 * @method findAll
 * @method findOne
 */
@Controller(transfers)
@UseGuards(JwtAuthGuard)
export class TransferController {
  /**
   * Creates an instance of TransferController.
   * @param {TransferService} transferService - The service for accessing transfer functionalities.
   */
  constructor(private readonly transferService: TransferService) {}

  /**
   * Create a transfer object and balance amount between sender and receiver.
   * @method
   *
   * @param {Object} req - The request object.
   * @param {CreateTransferDto} createTransferDto - The transfer's create detail.
   * @param {string} updateProfileDto.amount - The amount of the transaction.
   * @param {string} updateProfileDto.receiverId - The receiverId of the transaction.
   * @param {string} updateProfileDto.description - The description of the transaction.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   */
  @Post()
  create(
    @Req() req: Request & ReqUser,
    @Body() createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return this.transferService.create(req.user.id, createTransferDto);
  }

  /**
   * Finds all transfers made in the system by a user.
   * @method
   *
   * @param {Object} req - The request object.
   * @param {PaginateQuery} query - The transfer's create detail.
   *
   * @returns {Promise<Paginated<Transfer>>} A promise that resolves when the transfers are fetched.
   */
  @Get()
  findAll(
    @Req() req: Request & ReqUser,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Transfer>> {
    return this.transferService.findAll(req.user.id, query);
  }

  /**
   * Finds a transfer made in the system by a user by ID.
   * @method
   *
   * @param {Object} req - The request object.
   * @param {string} id - The transfer ID.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   */
  @Get(':id')
  findOne(@Req() req: Request & ReqUser, @Param('id') id: string): Promise<Transfer> {
    return this.transferService.findOne(req.user.id, id);
  }
}
