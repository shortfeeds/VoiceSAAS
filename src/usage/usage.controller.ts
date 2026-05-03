import { Controller, Get, Request } from '@nestjs/common';
import { UsageService } from './usage.service';

@Controller('api/usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get('current')
  async getCurrentUsage(@Request() req) {
    const clientId = req.user?.clientId || 'mock-client-id';
    return this.usageService.getUsage(clientId);
  }
}

