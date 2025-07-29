import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { CreateBooking } from '@repo/types';

export class CreateBookingDto implements CreateBooking {
  @ApiProperty({
    description: 'Visitor full name',
    example: 'Jane Smith',
  })
  @IsString()
  visitorName: string;

  @ApiProperty({
    description: 'Visitor email address',
    example: 'jane.smith@example.com',
  })
  @IsEmail()
  visitorEmail: string;

  @ApiProperty({
    description: 'Visitor phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  visitorPhone?: string;

  @ApiProperty({
    description: 'Additional notes or comments',
    example: 'I have a specific question about the consultation',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
