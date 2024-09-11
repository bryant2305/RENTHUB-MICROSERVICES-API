import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3006);
  const url = configService.get<number>('URL');

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'email_proto',
      protoPath: join(
        __dirname,
        '../../mail-service/src/shared/protos/email.proto',
      ),
      url: `${url}:${port}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') || 0);
}
bootstrap();
