/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus, UpdateBookingStatus } from '@repo/types';

export class UpdateBookingStatusDto implements UpdateBookingStatus {
  @ApiProperty({
    description: 'New booking status',
    enum: BookingStatus,
    example: BookingStatus.APPROVED,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
