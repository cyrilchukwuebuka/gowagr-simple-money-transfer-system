import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Represents a controller for app base route in the system.
 * @class
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
