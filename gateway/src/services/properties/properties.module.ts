import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UtilsService } from 'src/utils/utils.service';

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
              '../../../src/shared/protos/properties.proto',
            ),
            url: configService.get('PROPERTIES_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, UtilsService],
})
export class PropertiesModule {}
