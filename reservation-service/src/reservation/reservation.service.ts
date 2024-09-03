import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    const createdReservation =
      await this.reservationRepository.save(createReservationDto);

    try {
      return {
        error: false,
        message: 'reservation created!',
        reservation: createdReservation,
      };
    } catch (error) {
      return {
        error: true,
        message: `error creating reservation ${error.message}`,
        reservation: createdReservation,
      };
    }
  }
}
