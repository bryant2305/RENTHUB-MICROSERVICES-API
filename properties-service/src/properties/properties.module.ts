import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schema/property.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Property.name,
        schema: PropertySchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'USER-SERVICE',
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
        name: 'RESERVATION',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'reservations_proto',
            protoPath: join(
              __dirname,
              '../../src/shared/protos/reservations.proto',
            ),
            url: configService.get('RESERVATIONS_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
