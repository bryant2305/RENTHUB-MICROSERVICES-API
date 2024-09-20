import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { UtilsService } from 'src/utils/utils.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ReservationServiceInterface } from 'src/Interfaces/reservation-interface';

@Injectable()
export class ReservationsService {
  private reservationService: ReservationServiceInterface;
  constructor(
    @Inject('RESERVATIONS')
    private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly utilsService: UtilsService,
  ) {
    this.reservationService =
      this.client.getService<ReservationServiceInterface>('ReservationService');
  }
  async create(createReservationDto: CreateReservationDto) {
    await this.cacheManager.del(process.env.RESERVATION_CACHE_KEY);
    return this.reservationService.createReservation(createReservationDto);
  }
  async findReservation(id: number) {
    const cacheKey = `${process.env.RESERVATION_CACHE_KEY}_${id}`;
    return await this.utilsService.getOrSetCache(cacheKey, async () => {
      return await this.reservationService.findReservation({ id }).toPromise();
    });
  }
  async cancelReservation(id: number) {
    return this.reservationService.cancelReservation({ id });
  }
}
