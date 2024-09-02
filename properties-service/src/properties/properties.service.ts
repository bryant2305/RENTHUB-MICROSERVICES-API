import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  create(createPropertyDto: CreatePropertyDto) {
    return 'This action adds a new property';
  }


}
