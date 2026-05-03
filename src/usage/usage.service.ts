import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  async getUsage(clientId: string, month?: string) {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    return this.prisma.usage.findUnique({
      where: {
        clientId_month: {
          clientId,
          month: targetMonth,
        },
      },
    });
  }

  async trackCall(clientId: string, durationSeconds: number) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const minutes = durationSeconds / 60;

    return this.prisma.usage.upsert({
      where: {
        clientId_month: {
          clientId,
          month: currentMonth,
        },
      },
      update: {
        totalCalls: { increment: 1 },
        minutesUsed: { increment: minutes },
        minutesRemaining: { decrement: minutes },
      },
      create: {
        clientId,
        month: currentMonth,
        totalCalls: 1,
        minutesUsed: minutes,
        minutesRemaining: 1000 - minutes, // Assume 1000 base for new
      },
    });
  }
}
