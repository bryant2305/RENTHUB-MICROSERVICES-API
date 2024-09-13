import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RESERVATIONS',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'reservations_proto',
            protoPath: join(
              __dirname,
              '../../../src/shared/protos/reservations.proto',
            ),
            url: configService.get('RESERVATIONS_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, UtilsService],
})
export class ReservationsModule {}
