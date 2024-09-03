import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

// DTO para la creación de una reserva
export class CreateReservationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  propertyId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '2024-09-01T00:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  checkIn: Date;

  @ApiProperty({ example: '2024-09-05T00:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  checkOut: Date;
}
