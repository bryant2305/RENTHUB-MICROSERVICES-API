import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PropertyAvailability } from './entities/property_availability.entity';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class ReservationService {
  private userService: any;
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(PropertyAvailability)
    private readonly propertyAvailabilityRepository: Repository<PropertyAvailability>,
    private readonly utilService: UtilsService,
    @Inject('USER-AUTH')
    private readonly userClient: ClientGrpc,
  ) {
    this.userService = this.userClient.getService('UserService');
  }
  async create(createReservationDto: CreateReservationDto) {
    try {
      const user = await lastValueFrom(
        this.userService.getUserById({ id: createReservationDto.userId }),
      );

      if (!user) {
        return {
          error: true,
          message: 'User not found',
          reservation: null,
        };
      }

      // Verificar disponibilidad de la propiedad
      const checkInDate = new Date(createReservationDto.checkIn);
      const checkOutDate = new Date(createReservationDto.checkOut);

      if (checkInDate >= checkOutDate) {
        return {
          error: true,
          message: 'Check-out date must be later than check-in date',
        };
      }
      const isAvailable = await this.utilService.checkPropertyAvailability(
        createReservationDto.propertyId,
        checkInDate, // Pasa Date
        checkOutDate, // Pasa Date
      );

      if (!isAvailable) {
        return {
          error: true,
          message: 'Property is not available for the selected dates',
        };
      }

      const createdReservation =
        await this.reservationRepository.save(createReservationDto);

      const propertyAvailability = this.propertyAvailabilityRepository.create({
        propertyId: createReservationDto.propertyId,
        startDate: createReservationDto.checkIn,
        endDate: createReservationDto.checkOut,
      });

      await this.propertyAvailabilityRepository.save(propertyAvailability);

      return {
        error: false,
        message: 'reservation created!',
        reservation: createdReservation,
      };
    } catch (error) {
      return {
        error: true,
        message: `error creating reservation ${error.message}`,
      };
    }
  }
}
