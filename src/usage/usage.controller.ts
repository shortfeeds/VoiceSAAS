import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrentUsage(@Request() req: any) {
    const clientId = req.user?.clientId || 'mock-client-id';
    return this.usageService.getUsage(clientId);
  }
}

