import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.plan.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }
}
