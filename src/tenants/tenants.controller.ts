import { Controller, Get, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('api/tenant-config')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get(':did')
  async getConfig(@Param('did') did: string) {
    return this.tenantsService.getConfigByDid(did);
  }
}
