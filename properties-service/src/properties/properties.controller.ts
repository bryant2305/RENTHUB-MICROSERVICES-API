import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @GrpcMethod('PropertiesService', 'create')
  create(@Payload() createPropertyDto: CreatePropertyDto) {
    console.log("llegue")
    return this.propertiesService.create(createPropertyDto);
  }
}
