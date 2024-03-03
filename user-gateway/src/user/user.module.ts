import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Services } from 'src/common/enums/services.enum';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Services.USERS,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: parseInt(configService.get('REDIS_PORT')),
            retryAttempts: 5,
            retryDelay: 10000,
            keepAlive: 10000,
          },
        }),
      },
    ]),
    ConfigModule, // Agrega ConfigModule a los imports
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
