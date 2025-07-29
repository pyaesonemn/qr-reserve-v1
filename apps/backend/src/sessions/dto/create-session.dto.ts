import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { CreateSession } from '@repo/types';

export class CreateSessionDto implements CreateSession {
  @ApiProperty({
    description: 'Session title',
    example: 'Doctor Appointment',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Session description',
    example: 'General consultation with Dr. Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Session location',
    example: 'Room 101, Medical Center',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Session start time (ISO 8601 format)',
    example: '2024-02-01T10:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Session end time (ISO 8601 format)',
    example: '2024-02-01T11:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Maximum number of bookings allowed',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  maxBookings: number;
}
