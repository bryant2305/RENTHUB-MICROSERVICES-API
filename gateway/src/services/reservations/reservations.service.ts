import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { UtilsService } from 'src/utils/utils.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ReservationsService {
  private service: any;
  constructor(
    @Inject('RESERVATIONS')
    private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly utilsService: UtilsService,
  ) {
    this.service = this.client.getService('ReservationService');
  }
  async create(createReservationDto: CreateReservationDto) {
    await this.cacheManager.del(process.env.RESERVATION_CACHE_KEY);
    return await this.service.createReservation(createReservationDto);
  }
  async findReservation(id: number) {
    const cacheKey = `${process.env.RESERVATION_CACHE_KEY}_${id}`;
    return await this.utilsService.getOrSetCache(cacheKey, async () => {
      return await this.service.findReservation({ id }).toPromise();
    });
  }
  async cancelReservation(id: number) {
    return await this.service.cancelReservation({ id });
  }
}
