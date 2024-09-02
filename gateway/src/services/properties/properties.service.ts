import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PropertiesService {
  private service: any;
  constructor(
    @Inject('PROPERTIES')
    private readonly client: ClientGrpc,
  ) {
    this.service = this.client.getService('PropertiesService');
  }
  create(createPropertyDto: CreatePropertyDto) {
    return this.service.create(createPropertyDto);
  }
}
