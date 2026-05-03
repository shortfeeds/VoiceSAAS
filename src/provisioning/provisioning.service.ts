import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as plivo from 'plivo';
import { SipClient } from 'livekit-server-sdk';

@Injectable()
export class ProvisioningService {
  private plivoClient: plivo.Client;
  private livekitSipClient: SipClient;

  constructor(private prisma: PrismaService) {
    this.plivoClient = new plivo.Client(
      process.env.PLIVO_AUTH_ID,
      process.env.PLIVO_AUTH_TOKEN,
    );
    this.livekitSipClient = new SipClient(
      process.env.LIVEKIT_URL || 'wss://inboundvoice-qw79bwz1.livekit.cloud',
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
    );
  }

  /**
   * Orchestrates the full provisioning flow for a new tenant:
   * 1. Buys a phone number (mocked or real based on env)
   * 2. Registers the DID in the database
   * 3. Creates a LiveKit SIP Dispatch Rule pointing to this tenant
   */
  async provisionTenant(clientId: string, region: string = 'IN') {
    console.log(`[Provisioning] Starting provisioning for client: ${clientId}`);
    try {
      // 1. Search & Buy Number
      const number = await this.buyNumber(region);
      console.log(`[Provisioning] Acquired number: ${number}`);

      // 2. Create LiveKit Dispatch Rule
      const dispatchRule = await this.livekitSipClient.createSipDispatchRule(
        {
          type: 'direct',
          roomName: `room-${clientId}`,
          pin: '',
        } as any,
        {
          name: `Rule for ${number}`,
          trunkIds: [], // Empty means applies to all trunks (or specify the Plivo trunk ID)
        }
      );
      console.log(`[Provisioning] Created SIP rule: ${dispatchRule.sipDispatchRuleId}`);

      // 3. Save to Database
      const didRecord = await this.prisma.didPool.create({
        data: {
          phoneNumber: number,
          provider: 'plivo',
          assignedTo: clientId,
          status: 'assigned',
          sipTrunkId: dispatchRule.sipDispatchRuleId,
        },
      });

      return {
        success: true,
        did: didRecord,
      };
    } catch (error) {
      console.error(`[Provisioning] Failed to provision tenant:`, error);
      throw new InternalServerErrorException('Provisioning failed');
    }
  }

  async searchNumbers(countryIso: string = 'IN') {
    try {
      const response = await this.plivoClient.numbers.search(countryIso, {
        type: 'local',
      });
      return response;
    } catch (error) {
      console.error('[Provisioning] Plivo search failed:', error);
      // Fallback for development without real credits
      return [{ number: `+9180${Math.floor(1000000 + Math.random() * 9000000)}` }];
    }
  }

  private async buyNumber(countryIso: string): Promise<string> {
    const isDev = process.env.NODE_ENV !== 'production';
    
    const numbers = await this.searchNumbers(countryIso);
    if (!numbers || numbers.length === 0) {
      throw new Error('No numbers available for this region');
    }

    const targetNumber = (numbers[0] as any).number;

    if (isDev) {
      console.log(`[Provisioning] DEV MODE: Mocking purchase of ${targetNumber}`);
      return targetNumber;
    }

    // Real purchase
    await this.plivoClient.numbers.buy(targetNumber);
    // Note: We also need to attach the Plivo Application to the number here
    // await this.plivoClient.numbers.update(targetNumber, { appId: process.env.PLIVO_APP_ID });
    
    return targetNumber;
  }
}
