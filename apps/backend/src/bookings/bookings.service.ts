/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import {
  BookingResponseDto,
  PublicBookingResponseDto,
} from './dto/booking-response.dto';
import { BookingStatus } from '@repo/types';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    sessionId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<PublicBookingResponseDto> {
    // Check if session exists and is active
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: [BookingStatus.PENDING, BookingStatus.APPROVED],
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

    // Check if session has ended
    if (session.endTime <= new Date()) {
      throw new BadRequestException(
        'Cannot book a session that has already ended',
      );
    }

    // Check if session is full
    if (session._count.bookings >= session.maxBookings) {
      throw new ConflictException('Session is fully booked');
    }

    // Check if visitor has already booked this session
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        sessionId,
        visitorEmail: createBookingDto.visitorEmail,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.APPROVED],
        },
      },
    });

    if (existingBooking) {
      throw new ConflictException('You have already booked this session');
    }

    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        sessionId,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        session: {
          select: {
            title: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    return {
      id: booking.id,
      status: booking.status as BookingStatus,
      createdAt: booking.createdAt,
      sessionTitle: booking.session.title,
      sessionStartTime: booking.session.startTime,
      sessionEndTime: booking.session.endTime,
    };
  }

  async findAllBySession(
    sessionId: string,
    userId: string,
  ): Promise<BookingResponseDto[]> {
    // Verify that the session belongs to the user
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException(
        'Session not found or you do not have access to it',
      );
    }

    const bookings = await this.prisma.booking.findMany({
      where: { sessionId },
      include: {
        session: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings.map((booking) => ({
      ...booking,
      status: booking.status as BookingStatus,
      session: {
        ...booking.session,
        bookingCount: booking.session._count.bookings,
      },
    }));
  }

  async findAllByUser(userId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        session: {
          userId,
        },
      },
      include: {
        session: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings.map((booking) => ({
      ...booking,
      status: booking.status as BookingStatus,
      session: {
        ...booking.session,
        bookingCount: booking.session._count.bookings,
      },
    }));
  }

  async findOne(id: string, userId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        session: {
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
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if the user owns the session
    if (booking.session.userId !== userId) {
      throw new ForbiddenException(
        'You can only access bookings for your own sessions',
      );
    }

    return {
      ...booking,
      status: booking.status as BookingStatus,
      session: {
        ...booking.session,
        bookingCount: booking.session._count.bookings,
      },
    };
  }

  async updateStatus(
    id: string,
    userId: string,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<BookingResponseDto> {
    // First, get the booking and verify ownership
    const booking = await this.findOne(id, userId);

    // Validate status transition
    const { status } = updateBookingStatusDto;
    const currentStatus = booking.status;

    // Define valid status transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.APPROVED, BookingStatus.REJECTED],
      [BookingStatus.APPROVED]: [BookingStatus.CANCELLED],
      [BookingStatus.REJECTED]: [], // Cannot change from rejected
      [BookingStatus.CANCELLED]: [], // Cannot change from cancelled
    };

    if (!validTransitions[currentStatus].includes(status)) {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus} to ${status}`,
      );
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        session: {
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
        },
      },
    });

    return {
      ...updatedBooking,
      status: updatedBooking.status as BookingStatus,
      session: {
        ...updatedBooking.session,
        bookingCount: updatedBooking.session._count.bookings,
      },
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    // Verify ownership first
    await this.findOne(id, userId);

    await this.prisma.booking.delete({
      where: { id },
    });
  }
}
