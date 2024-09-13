import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PropertyAvailability } from './entities/property_availability.entity';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, PropertyAvailability]),
    ClientsModule.registerAsync([
      {
        name: 'USER-SERVICES',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user_proto',
            protoPath: join(__dirname, '../../src/shared/protos/user.proto'),
            url: configService.get('USER_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PROPERTIES',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'properties_proto',
            protoPath: join(
              __dirname,
              '../../src/shared/protos/properties.proto',
            ),
            url: configService.get('PROPERTIES_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EMAIL',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'email_proto',
            protoPath: join(__dirname, '../../src/shared/protos/email.proto'),
            url: configService.get('EMAIL_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, UtilsService],
})
export class ReservationModule {}
