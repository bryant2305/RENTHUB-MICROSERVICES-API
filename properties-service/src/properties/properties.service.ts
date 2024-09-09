import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './schema/property.schema';
import { Model } from 'mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class PropertiesService {
  private propertyService: any;
  constructor(
    @Inject('USER-AUTH')
    private readonly propertyClient: ClientGrpc,
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {
    this.propertyService = this.propertyClient.getService('UserService');
  }
  async create(createPropertyDto: CreatePropertyDto) {
    try {
      let user;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user = await lastValueFrom(
          this.propertyService.getUserById({
            id: createPropertyDto.hostId,
          }),
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return {
          error: true,
          message: 'User not found',
        };
      }

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

  findOneById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return this.propertyModel.findOne({ _id: id });
  }

  async findAllProperties() {
    try {
      const properties = await this.propertyModel.find();
      return {
        error: false,
        properties,
      };
    } catch (error) {
      return {
        error: true,
        message: `error creating property ${error.message}`,
      };
    }
  }

  async updateProperty(id: string, updateData: any) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return this.propertyModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  deleteProperty(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return this.propertyModel.findByIdAndDelete({ _id: id });
  }
}
