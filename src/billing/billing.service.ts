import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private usageService: UsageService,
  ) {}

  /**
   * Generates a mock checkout URL. In production, this would call Razorpay API.
   */
  async createCheckoutSession(clientId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new BadRequestException('Invalid plan ID');

    // MOCK: Return a fake URL
    return {
      url: `https://checkout.razorpay.com/mock-checkout?client=${clientId}&plan=${planId}&amount=${plan.price}`,
    };
  }

  /**
   * Processes a successful payment webhook
   */
  async handlePaymentSuccess(clientId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new BadRequestException('Invalid plan ID');

    // 1. Update the client's plan
    await this.prisma.client.update({
      where: { id: clientId },
      data: { planId: plan.id },
    });

    // 2. Add minutes to their usage pool
    const currentMonth = new Date().toISOString().slice(0, 7);
    await this.prisma.usage.upsert({
      where: {
        clientId_month: { clientId, month: currentMonth },
      },
      update: {
        minutesRemaining: { increment: plan.minutesLimit },
      },
      create: {
        clientId,
        month: currentMonth,
        minutesRemaining: plan.minutesLimit,
        minutesUsed: 0,
        totalCalls: 0,
      },
    });

    return { success: true, addedMinutes: plan.minutesLimit };
  }
}
