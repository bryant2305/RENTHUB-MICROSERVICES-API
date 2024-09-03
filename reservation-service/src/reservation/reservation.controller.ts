import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @GrpcMethod('ReservationService', 'createReservation')
  create(@Payload() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }
}
