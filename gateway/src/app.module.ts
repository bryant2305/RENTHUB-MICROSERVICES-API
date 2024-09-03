import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertiesModule } from './services/properties/properties.module';
import { ReservationsModule } from './services/reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    UserModule,
    PropertiesModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static redisHost: string;
  static redisPort: number;
  static redisPassword: string;

  constructor(private readonly configService: ConfigService) {
    AppModule.redisHost = this.configService.get<string>('REDIS_HOST');
    AppModule.redisPort = this.configService.get<number>('REDIS_PORT');
    AppModule.redisPassword = this.configService.get<string>('REDIS_PASSWORD');
  }
}
