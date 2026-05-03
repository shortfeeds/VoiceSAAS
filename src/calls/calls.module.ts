import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsageModule } from '../usage/usage.module';

@Module({
  imports: [PrismaModule, UsageModule],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
