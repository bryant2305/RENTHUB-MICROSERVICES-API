import { IsString } from 'class-validator';

export class CreateEmailReservationDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  title: string;

  @IsString()
  address: string;

  @IsString()
  checkIn: string;

  @IsString()
  checkOut: string;
}
