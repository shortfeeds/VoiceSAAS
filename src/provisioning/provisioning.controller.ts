import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProvisioningService } from './provisioning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/provisioning')
export class ProvisioningController {
  constructor(private readonly provisioningService: ProvisioningService) {}

  @Post('provision')
  async provisionTenant(@Body('clientId') clientId: string, @Body('region') region?: string) {
    if (!clientId) {
      throw new Error('clientId is required');
    }
    return this.provisioningService.provisionTenant(clientId, region);
  }
}
