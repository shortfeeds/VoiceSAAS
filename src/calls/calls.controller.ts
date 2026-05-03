import { Controller, Post, Body } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('api/calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  async logCall(@Body() data: any) {
    return this.callsService.logCall(data);
  }
}
