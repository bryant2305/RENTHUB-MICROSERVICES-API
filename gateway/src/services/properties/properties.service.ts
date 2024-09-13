import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class PropertiesService {
  private service: any;
  constructor(
    @Inject('PROPERTIES')
    private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly utilsService: UtilsService,
  ) {
    this.service = this.client.getService('PropertiesService');
  }
  async create(createPropertyDto: CreatePropertyDto) {
    await this.cacheManager.del(process.env.PROPERTIES_CACHE_KEY);
    return await this.service.create(createPropertyDto);
  }
  async getAll() {
    return await this.utilsService.getOrSetCache(
      process.env.PROPERTIES_CACHE_KEY,
      async () => {
        return await this.service.getAllProperties({}).toPromise();
      },
    );
  }

  async findProperty(id: string) {
    const cacheKey = `${process.env.PROPERTIES_CACHE_KEY}_${id}`;
    return await this.utilsService.getOrSetCache(cacheKey, async () => {
      return await this.service.getPropertyById({ id }).toPromise();
    });
  }
  async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto) {
    const cacheKey = `${process.env.PROPERTIES_CACHE_KEY}_${id}`;
    // Elimina el caché de la propiedad actualizada
    await this.cacheManager.del(cacheKey);
    return await this.service.updateProperty({
      id,
      title: updatePropertyDto.title,
      description: updatePropertyDto.description,
      address: updatePropertyDto.address,
      propertyType: updatePropertyDto.propertyType,
      size: updatePropertyDto.size,
      bedrooms: updatePropertyDto.bedrooms,
      bathrooms: updatePropertyDto.bathrooms,
      capacity: updatePropertyDto.capacity,
      hostId: updatePropertyDto.hostId,
    });
  }
  async deleteProperty(id: string) {
    return await this.service.deleteProperty({ id });
  }
}
