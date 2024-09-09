import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @GrpcMethod('PropertiesService', 'create')
  create(@Payload() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @GrpcMethod('PropertiesService', 'getPropertyById')
  getPropertyById(@Payload() data: { id: string }) {
    return this.propertiesService.findOneById(data.id);
  }

  @GrpcMethod('PropertiesService', 'getAllProperties')
  getAllProperties() {
    return this.propertiesService.findAllProperties();
  }

  @GrpcMethod('PropertiesService', 'updateProperty')
  updateProperty(data: UpdatePropertyDto) {
    const {
      id,
      title,
      description,
      address,
      propertyType,
      size,
      bedrooms,
      bathrooms,
      capacity,
      hostId,
    } = data;

    // Aquí puedes pasar los campos al método de actualización
    return this.propertiesService.updateProperty(id, {
      title,
      description,
      address,
      propertyType,
      size,
      bedrooms,
      bathrooms,
      capacity,
      hostId,
    });
  }
  @GrpcMethod('PropertiesService', 'deleteProperty')
  deleteProperty(@Payload() data: { id: string }) {
    return this.propertiesService.deleteProperty(data.id);
  }
}
