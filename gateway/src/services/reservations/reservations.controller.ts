import { Controller, Post } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiTags('reservations')
  @Post('reservations')
  create(@Payload() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }
}
