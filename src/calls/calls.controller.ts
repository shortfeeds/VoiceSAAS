import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  async logCall(@Body() data: any) {
    return this.callsService.logCall(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCalls() {
    return this.callsService.getCalls();
  }
}

