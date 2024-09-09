import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  private service: any;
  constructor(
    @Inject('PROPERTIES')
    private readonly client: ClientGrpc,
  ) {
    this.service = this.client.getService('PropertiesService');
  }
  async create(createPropertyDto: CreatePropertyDto) {
    return await this.service.create(createPropertyDto);
  }
  async getAll() {
    return await this.service.getAllProperties({});
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
