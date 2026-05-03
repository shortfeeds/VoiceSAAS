import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(data: any) {
    const { tenantId, caller_name, caller_phone, caller_email, preferred_date, purpose } = data;
    
    return this.prisma.booking.create({
      data: {
        clientId: tenantId,
        callerName: caller_name,
        callerPhone: caller_phone,
        callerEmail: caller_email,
        preferredDate: preferred_date,
        purpose: purpose,
        status: 'pending',
      },
    });
  }
}
