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
  @GrpcMethod('ReservationService', 'findReservartion')
  async findReservation(data: { id: number }) {
    const reservation = await this.reservationService.findReservation(data.id);

    if (!reservation) {
      return {
        error: true,
        message: `reservation with ID ${data.id} not found `,
      };
    }
    return {
      propertyId: reservation.propertyId,
      userId: reservation.userId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
    };
  }
  @GrpcMethod('ReservationService', 'findReservationByPropertyId')
  async findPropertyReservation(data: { propertyId: string }) {
    return await this.reservationService.findReservationByPropertyId(
      data.propertyId,
    );
  }

  @GrpcMethod('ReservationService', 'cancelReservation')
  deleteProperty(@Payload() data: { id: number }) {
    return this.reservationService.deleteReservation(data.id);
  }
}
