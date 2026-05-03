import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckout(@Request() req: any, @Body('planId') planId: string) {
    return this.billingService.createCheckoutSession(req.user.clientId, planId);
  }

  // Note: Webhooks usually don't use JWT. They use a signature from the payment provider.
  // For now, this is just a mock endpoint.
  @Post('webhook')
  async handleWebhook(@Body() data: any) {
    if (data.event === 'payment.captured') {
      return this.billingService.handlePaymentSuccess(data.payload.clientId, data.payload.planId);
    }
    return { received: true };
  }
}
