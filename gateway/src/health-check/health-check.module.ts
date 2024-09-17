import { Module } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { HealthCheckController } from './health-check.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
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
        name: 'RESERVATIONS',
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
        name: 'AUTH',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth_proto',
            protoPath: join(__dirname, '../../src/shared/protos/auth.proto'),
            url: configService.get('AUTH_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
