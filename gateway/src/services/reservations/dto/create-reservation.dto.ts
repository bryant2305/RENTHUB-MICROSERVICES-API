import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

// DTO para la creación de una reserva
export class CreateReservationDto {
  @ApiProperty({ example: '66db1cbaace4dfff5c1d8c63' })
  @IsString()
  propertyId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '2024-09-01' })
  @IsDate()
  @Type(() => Date)
  checkIn: Date;

  @ApiProperty({ example: '2024-09-05' })
  @IsDate()
  @Type(() => Date)
  checkOut: Date;
}
