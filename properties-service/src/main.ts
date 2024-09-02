import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3001);
  const url = configService.get<number>('URL');

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'properties_proto',
      protoPath: join(__dirname, '../src/protos/properties.proto'),
      url: `${url}:${port}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
