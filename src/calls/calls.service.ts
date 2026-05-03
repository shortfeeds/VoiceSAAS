import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async logCall(data: {
    tenantId: string;
    callerNumber: string;
    duration: number;
    turns: number;
    status: string;
  }) {
    try {
      return await this.prisma.call.create({
        data: {
          clientId: data.tenantId,
          callerNumber: data.callerNumber,
          duration: data.duration,
          turns: data.turns,
          status: data.status,
        },
      });
    } catch (error) {
      console.warn(`[CallsService] Failed to log call to database: ${error.message}`);
      return { success: false, error: 'Database unreachable' };
    }
  }

}
