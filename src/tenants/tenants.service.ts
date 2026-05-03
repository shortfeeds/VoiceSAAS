import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getConfigByDid(did: string) {
    try {
      // 1. Find the client assigned to this DID
      const didRecord = await this.prisma.didPool.findUnique({
        where: { phoneNumber: did },
        include: {
          client: {
            include: {
              agentConfig: true,
              usage: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      });

      if (!didRecord || !didRecord.client) {
        // Fallback: If no DID assigned, maybe check if a client has this phone number directly
        const client = await this.prisma.client.findFirst({
          where: { phoneNumber: did },
          include: {
            agentConfig: true,
            usage: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        });

        if (!client) {
          return this.getMockConfig(did);
        }

        return this.mapToAgentConfig(client);
      }

      return this.mapToAgentConfig(didRecord.client);
    } catch (error) {
      console.warn(`[TenantsService] Database unreachable, using mock config for DID: ${did}`);
      return this.getMockConfig(did);
    }
  }

  private getMockConfig(did: string) {
    return {
      tenantId: 'mock-tenant-id',
      businessName: 'Trinity Pixels (MOCK)',
      agentName: 'Aria',
      firstLine: 'Hello! Thanks for calling Trinity Pixels. How can I help you today?',
      systemPrompt: 'You are Aria, a friendly receptionist for Trinity Pixels, a digital agency.',
      sttProvider: 'sarvam',
      sttLanguage: 'en-IN',
      ttsProvider: 'sarvam',
      ttsVoice: 'kavya',
      ttsLanguage: 'hi-IN',
      llmProvider: 'groq',
      llmModel: 'llama-3.3-70b-versatile',
      maxTurns: 25,
      transferNumber: '+917710884479',
      minutesRemaining: 100,
    };
  }


  private mapToAgentConfig(client: any) {
    const config = client.agentConfig;
    const usage = client.usage?.[0];

    return {
      tenantId: client.id,
      businessName: client.name,
      agentName: config?.agentName || 'Receptionist',
      firstLine: config?.firstLine,
      systemPrompt: config?.instructions,
      sttProvider: client.sttProvider,
      sttLanguage: config?.sttLanguage || 'unknown',
      ttsProvider: client.ttsProvider,
      ttsVoice: config?.voice || 'kavya',
      ttsLanguage: config?.language || 'hi-IN',
      llmProvider: client.llmProvider,
      llmModel: 'llama-3.3-70b-versatile', // Default for Phase 1
      maxTurns: config?.maxTurns || 25,
      transferNumber: config?.transferNumber,
      minutesRemaining: usage ? Number(usage.minutesRemaining) : 10, // Default 10 mins for new
    };
  }
}
