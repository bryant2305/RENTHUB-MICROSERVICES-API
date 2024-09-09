import { InjectRepository } from '@nestjs/typeorm';
import { PropertyAvailability } from 'src/reservation/entities/property_availability.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';

export class UtilsService {
  constructor(
    @InjectRepository(PropertyAvailability)
    private readonly propertyAvailabilityRepository: Repository<PropertyAvailability>,
  ) {} // Inyecta el repositorio adecuado

  async checkPropertyAvailability(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const conflicts = await this.propertyAvailabilityRepository.find({
      where: [
        {
          propertyId,
          startDate: LessThan(checkOut),
          endDate: MoreThan(checkIn),
        },
      ],
    });

    // Si hay conflictos, la propiedad no está disponible
    return conflicts.length === 0;
  }
}
