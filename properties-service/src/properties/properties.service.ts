import { Inject, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './schema/property.schema';
import { Model } from 'mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ReservationResponse,
  ReservationServiceInterface,
} from '../Interfaces/reservation-interface';
import { UserServiceInterface } from 'src/Interfaces/user-interface';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class PropertiesService {
  private userService: UserServiceInterface;
  private reservationService: ReservationServiceInterface;
  constructor(
    @Inject('USER-SERVICE')
    private readonly userClient: ClientGrpc,
    @Inject('RESERVATION')
    private readonly reservationClient: ClientGrpc,
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {
    this.userService =
      this.userClient.getService<UserServiceInterface>('UserService'); // y como eto funca
    this.reservationService =
      this.reservationClient.getService<ReservationServiceInterface>(
        'ReservationService',
      );
  }
  async create(createPropertyDto: CreatePropertyDto) {
    try {
      let user;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user = await lastValueFrom(
          this.userService.getUserById({
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
      return {
        error: true,
        message: ` property with ID ${id} doesn't exist`,
      };
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
      return {
        error: true,
        message: ` property with ID ${id} doesn't exist`,
      };
    }
    return this.propertyModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProperty(propertyId: string) {
    try {
      const res: ReservationResponse = await lastValueFrom(
        this.reservationService.findReservationByPropertyId({ propertyId }),
      );

      if (res.error == true) {
        return {
          error: true,
          message:
            'No se puede eliminar la propiedad porque tiene una reserva vigente',
        };
      }

      if (!ObjectId.isValid(propertyId)) {
        return {
          error: true,
          message: 'ID de propiedad inválido',
        };
      }

      const result = await this.propertyModel.findByIdAndDelete(propertyId);

      if (!result) {
        return {
          error: true,
          message: 'No se pudo eliminar la propiedad',
        };
      }

      return { error: false, message: 'Propiedad eliminada exitosamente' };
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      return { error: true, message: 'Error en el servicio de propiedades' };
    }
  }
}
