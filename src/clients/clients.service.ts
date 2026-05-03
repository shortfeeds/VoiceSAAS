import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.findMany({
      include: {
        plan: true,
        agentConfig: true,
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        plan: true,
        agentConfig: true,
        didNumbers: true,
      },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async create(data: any) {
    return this.prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        planId: data.planId,
        sttProvider: data.sttProvider || 'sarvam',
        ttsProvider: data.ttsProvider || 'sarvam',
        llmProvider: data.llmProvider || 'groq',
        agentConfig: {
          create: {
            agentName: data.agentName || 'Receptionist',
            instructions: data.instructions,
            voice: data.voice || 'kavya',
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
