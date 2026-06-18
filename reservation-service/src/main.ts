import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const url = configService.get<number>('URL');

  // Run migrations in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const dataSource = app.get(DataSource);
      Logger.log('Running database migrations...');
      await dataSource.runMigrations();
      Logger.log('Database migrations completed successfully ✅');
    } catch (error) {
      Logger.error('Failed to run migrations', error);
      throw error;
    }
  }

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'reservations_proto',
      protoPath: join(__dirname, '../src/shared/protos/reservations.proto'),
      url: `${url}:${port}`,
    },
  });

  console.log('Starting App in Port: ', port);
  // await app.listen(port);
  await app.startAllMicroservices();
}

bootstrap().then(() => {
  Logger.log('Application is up and running 🚀');
});
