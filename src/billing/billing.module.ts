import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsageModule } from '../usage/usage.module';

@Module({
  imports: [PrismaModule, UsageModule],
  providers: [BillingService],
  controllers: [BillingController]
})
export class BillingModule {}
