import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class ReservationsService {
  private service: any;
  constructor(
    @Inject('RESERVATIONS')
    private readonly client: ClientGrpc,
  ) {
    this.service = this.client.getService('ReservationService');
  }
  async create(createReservationDto: CreateReservationDto) {
    return await this.service.createReservation(createReservationDto);
  }
  async findReservation(id: number) {
    return await this.service.findReservation({ id });
  }
  async cancelReservation(id: number) {
    return await this.service.cancelReservation({ id });
  }
}
