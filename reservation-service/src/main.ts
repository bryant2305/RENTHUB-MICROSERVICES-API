import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GrpcOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3001);
  const url = configService.get<number>('URL');
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'reservations_proto',
      protoPath: join(
        __dirname,
        '../../reservation-service/src/protos/reservations.proto',
      ),
      url: `${url}:${port}`,
    },
  });

  console.log('Starting App in Port: ', port);
  await app.listen(port);
  await app.startAllMicroservices();
}
bootstrap();
