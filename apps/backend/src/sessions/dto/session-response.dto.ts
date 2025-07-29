import { ApiProperty } from '@nestjs/swagger';
import { Session, PublicSession } from '@repo/types';
import { UserResponseDto } from '../../auth/dto/auth-response.dto';

export class SessionResponseDto implements Session {
  @ApiProperty({
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Session title',
    example: 'Doctor Appointment',
  })
  title: string;

  @ApiProperty({
    description: 'Session description',
    example: 'General consultation with Dr. Smith',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Session location',
    example: 'Room 101, Medical Center',
    required: false,
  })
  location?: string | null;

  @ApiProperty({
    description: 'Session start time',
    example: '2024-02-01T10:00:00Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Session end time',
    example: '2024-02-01T11:00:00Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Maximum number of bookings allowed',
    example: 10,
  })
  maxBookings: number;

  @ApiProperty({
    description: 'Whether the session is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'QR code data for booking',
    example: 'https://example.com/book/clxxx123456789',
    required: false,
  })
  qrCode?: string | null;

  @ApiProperty({
    description: 'Session creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Session owner/host information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Current number of bookings',
    example: 3,
  })
  bookingCount?: number | null;
}

export class PublicSessionResponseDto implements PublicSession {
  @ApiProperty({
    description: 'Session ID',
    example: 'clxxx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Session title',
    example: 'Doctor Appointment',
  })
  title: string;

  @ApiProperty({
    description: 'Session description',
    example: 'General consultation with Dr. Smith',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Session location',
    example: 'Room 101, Medical Center',
    required: false,
  })
  location?: string | null;

  @ApiProperty({
    description: 'Session start time',
    example: '2024-02-01T10:00:00Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Session end time',
    example: '2024-02-01T11:00:00Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Maximum number of bookings allowed',
    example: 10,
  })
  maxBookings: number;

  @ApiProperty({
    description: 'Current number of bookings',
    example: 3,
  })
  bookingCount: number;

  @ApiProperty({
    description: 'Whether bookings are still available',
    example: true,
  })
  isAvailable: boolean;
}
