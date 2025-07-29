import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import {
  SessionResponseDto,
  PublicSessionResponseDto,
} from './dto/session-response.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createSessionDto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    const { startTime, endTime, ...sessionData } = createSessionDto;

    // Validate that end time is after start time
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      throw new BadRequestException('End time must be after start time');
    }

    // Validate that start time is in the future
    if (start <= new Date()) {
      throw new BadRequestException('Start time must be in the future');
    }

    const session = await this.prisma.session.create({
      data: {
        ...sessionData,
        startTime: start,
        endTime: end,
        userId,
        qrCode: this.generateQRCodeData(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return {
      ...session,
      bookingCount: session._count.bookings,
    };
  }

  async findAllByUser(userId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map((session) => ({
      ...session,
      bookingCount: session._count.bookings,
    }));
  }

  async findOne(id: string, userId?: string): Promise<SessionResponseDto> {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // If userId is provided, check ownership
    if (userId && session.userId !== userId) {
      throw new ForbiddenException('You can only access your own sessions');
    }

    return {
      ...session,
      bookingCount: session._count.bookings,
    };
  }

  async findPublicSession(id: string): Promise<PublicSessionResponseDto> {
    const session = await this.prisma.session.findUnique({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startTime: true,
        endTime: true,
        maxBookings: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'APPROVED'],
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found or inactive');
    }

    const bookingCount = session._count.bookings;
    const isAvailable =
      bookingCount < session.maxBookings && session.endTime > new Date();

    return {
      ...session,
      bookingCount,
      isAvailable,
    };
  }

  async update(
    id: string,
    userId: string,
    updateSessionDto: Partial<CreateSessionDto>,
  ): Promise<SessionResponseDto> {
    // Check if session exists and belongs to user
    const existingSession = await this.findOne(id, userId);

    const { startTime, endTime, ...sessionData } = updateSessionDto;
    const updateData: Partial<{
      title?: string;
      description?: string;
      location?: string;
      startTime?: Date;
      endTime?: Date;
      maxBookings?: number;
    }> = { ...sessionData };

    // Validate dates if provided
    if (startTime || endTime) {
      const start = startTime ? new Date(startTime) : existingSession.startTime;
      const end = endTime ? new Date(endTime) : existingSession.endTime;

      if (end <= start) {
        throw new BadRequestException('End time must be after start time');
      }

      if (startTime) updateData.startTime = start;
      if (endTime) updateData.endTime = end;
    }

    const session = await this.prisma.session.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return {
      ...session,
      bookingCount: session._count.bookings,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if session exists and belongs to user
    await this.findOne(id, userId);

    await this.prisma.session.delete({
      where: { id },
    });
  }

  async toggleActive(id: string, userId: string): Promise<SessionResponseDto> {
    const session = await this.findOne(id, userId);

    const updatedSession = await this.prisma.session.update({
      where: { id },
      data: { isActive: !session.isActive },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return {
      ...updatedSession,
      bookingCount: updatedSession._count.bookings,
    };
  }

  private generateQRCodeData(): string {
    // In a real implementation, this would generate a proper QR code
    // For now, we'll just return a placeholder URL
    return `https://lazy-reserve.com/book/${Date.now()}`;
  }
}
