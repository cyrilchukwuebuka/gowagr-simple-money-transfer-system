import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ReqUser } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { transfers } from 'src/utils/routes';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferService } from './transfer.service';

@Controller(transfers)
@UseGuards(JwtAuthGuard)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  create(
    @Req() req: Request & ReqUser,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.transferService.create(req.user.id, createTransferDto);
  }

  @Get()
  findAll(@Req() req: Request & ReqUser, @Paginate() query: PaginateQuery) {
    return this.transferService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Req() req: Request & ReqUser, @Param('id') id: string) {
    return this.transferService.findOne(req.user.id, id);
  }
}
