import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertiesModule } from './services/properties/properties.module';
import { ReservationsModule } from './services/reservations/reservations.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST, // Cambia a la URL de tu servidor Redis si no es local
      port: process.env.REDIS_PORT,
      ttl: 60,
      isGlobal: true, // Tiempo en segundos para cachear (60 segundos en este caso)
    }),
    AuthModule,
    UserModule,
    PropertiesModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
