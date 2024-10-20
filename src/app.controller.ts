import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Represents a controller for app base route in the system.
 * @class
 */
@ApiTags('base')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({
    summary: 'Gets a hello world message from the server.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved message',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hello World!',
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
  getHello(): string {
    return this.appService.getHello();
  }
}
