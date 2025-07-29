/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, Booking, PublicBooking } from '@repo/types';
import { SessionResponseDto } from '../../sessions/dto/session-response.dto';

export class BookingResponseDto implements Booking {
  @ApiProperty({
    description: 'Booking ID',
    example: 'clxxx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Visitor full name',
    example: 'Jane Smith',
  })
  visitorName: string;

  @ApiProperty({
    description: 'Visitor email address',
    example: 'jane.smith@example.com',
  })
  visitorEmail: string;

  @ApiProperty({
    description: 'Visitor phone number',
    example: '+1234567890',
    required: false,
  })
  visitorPhone?: string | null;

  @ApiProperty({
    description: 'Additional notes or comments',
    example: 'I have a specific question about the consultation',
    required: false,
  })
  notes?: string | null;

  @ApiProperty({
    description: 'Current booking status',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Booking creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated session information',
    type: SessionResponseDto,
  })
  session: SessionResponseDto;
}

export class PublicBookingResponseDto implements PublicBooking {
  @ApiProperty({
    description: 'Booking ID',
    example: 'clxxx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Current booking status',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Booking creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Session title',
    example: 'Doctor Appointment',
  })
  sessionTitle: string;

  @ApiProperty({
    description: 'Session start time',
    example: '2024-02-01T10:00:00Z',
  })
  sessionStartTime: Date;

  @ApiProperty({
    description: 'Session end time',
    example: '2024-02-01T11:00:00Z',
  })
  sessionEndTime: Date;
}
