import { IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNumber()
  propertyId: number;

  @IsString()
  userId: number;

  @IsDate()
  @Type(() => Date)
  checkIn: Date;

  @IsDate()
  @Type(() => Date)
  checkOut: Date;
}
