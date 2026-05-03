import { PrismaService } from '../prisma/prisma.service';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class CallsService {
  constructor(
    private prisma: PrismaService,
    private usageService: UsageService,
  ) {}

  async logCall(data: {
    tenantId: string;
    callerNumber: string;
    duration: number;
    turns: number;
    status: string;
  }) {
    try {
      const call = await this.prisma.call.create({
        data: {
          clientId: data.tenantId,
          callerNumber: data.callerNumber,
          duration: data.duration,
          turns: data.turns,
          status: data.status,
        },
      });

      // Update usage tracking
      await this.usageService.trackCall(data.tenantId, data.duration || 0);

      return call;
    } catch (error) {
      console.warn(`[CallsService] Failed to log call to database: ${error.message}`);
      return { success: false, error: 'Database unreachable' };
    }
  }

}
