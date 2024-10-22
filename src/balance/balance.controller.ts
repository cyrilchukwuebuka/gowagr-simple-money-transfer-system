import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('balance')
export class BalanceController {
}
