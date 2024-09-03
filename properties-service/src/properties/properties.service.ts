import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './schema/property.schema';
import { Model } from 'mongoose';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {}
  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const property = new this.propertyModel(createPropertyDto);
      const savedProperty = await property.save();

      return {
        error: false,
        message: 'property created successfully',
        property: savedProperty,
      };
    } catch (error) {
      return {
        error: true,
        message: `error creating property ${error.message}`,
      };
    }
  }
}
