import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { CallsModule } from './calls/calls.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { UsageModule } from './usage/usage.module';
import { PlansModule } from './plans/plans.module';
import { ProvisioningModule } from './provisioning/provisioning.module';
import { BillingModule } from './billing/billing.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenantsModule,
    CallsModule,
    AuthModule,
    ClientsModule,
    UsageModule,
    PlansModule,
    ProvisioningModule,
    BillingModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
