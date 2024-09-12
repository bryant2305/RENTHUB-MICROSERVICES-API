import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PropertiesService {
  private service: any;
  constructor(
    @Inject('PROPERTIES')
    private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.service = this.client.getService('PropertiesService');
  }
  async create(createPropertyDto: CreatePropertyDto) {
    await this.cacheManager.del(process.env.PROPERTIES);
    return await this.service.create(createPropertyDto);
  }
  async getAll() {
    const cacheKey = process.env.PROPERTIES;

    // Intenta recuperar los datos del caché
    const cachedProperties = await this.cacheManager.get(cacheKey);

    // Verifica si existe caché
    if (cachedProperties) {
      return cachedProperties;
    }

    const properties = await this.service.getAllProperties({}).toPromise();

    // Verifica que los datos de la base de datos sean válidos antes de guardar en caché
    if (properties) {
      await this.cacheManager.set(cacheKey, properties, 60);
    }

    return properties;
  }

  async findProperty(id: string) {
    return await this.service.getPropertyById({ id });
  }
  async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto) {
    // Desempaqueta los campos del DTO para enviarlos en el formato esperado por el servicio gRPC
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
