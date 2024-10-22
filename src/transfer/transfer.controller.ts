import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { PaginationQueryDto } from 'src/base/pagination-query.dto';

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
@ApiTags('transfer')
@ApiBearerAuth()
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
   * @param {string} updateProfileDto.username - The receiver username of the transaction.
   * @param {string} updateProfileDto.description - The description of the transaction.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   */
  @ApiOperation({
    summary: 'Creates a Transfer between sender and receiver.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created new transfer',
    type: Transfer,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Post()
  create(
    @Req() req: Request & ReqUser,
    @Body() createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return this.transferService.create(req.user.id, createTransferDto);
  }

  /**
   * Deposits money into an authenticated user account.
   * @method
   *
   * @param {Object} req - The request object.
   * @param {DepositDto} depositDto - The deposit detail.
   * @param {string} depositDto.amount - The amount of the transaction.
   * @param {string} depositDto.description - The description of the transaction.
   *
   * @returns {Promise<Transfer>} A promise that resolves when the transfer is completed.
   */
  @ApiOperation({
    summary: 'Deposits money into an authenticated user account.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created new deposit',
    type: Transfer,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No user was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Put()
  deposit(
    @Req() req: Request & ReqUser,
    @Body() depositDto: DepositDto,
  ): Promise<Transfer> {
    return this.transferService.deposit(req.user.id, depositDto);
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
  @ApiOperation({
    summary: 'Gets transfers information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved transfers information',
    schema: {
      properties: {
        data: {
          type: 'array',
          // items: { $ref: '#/components/schemas/UserDto' },
        },
        meta: {
          type: 'object',
          properties: {
            totalCount: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get()
  findAll(
    @Req() req: Request & ReqUser,
    @Paginate() query: PaginationQueryDto,
  ): Promise<Paginated<Transfer>> {
    return this.transferService.findAll(req.user.id, query as any);
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
  @ApiOperation({
    summary: 'Gets a transfer detail by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved transfer information',
    type: Transfer,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials. Please try again',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials. Please try again',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No transfer was found with the provided ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Transfer not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get(':id')
  findOne(
    @Req() req: Request & ReqUser,
    @Param('id') id: string,
  ): Promise<Transfer> {
    return this.transferService.findOne(req.user.id, id);
  }
}
