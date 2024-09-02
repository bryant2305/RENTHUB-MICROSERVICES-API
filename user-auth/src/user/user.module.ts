import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from 'src/common/enums/services.enum';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.registerAsync([
      {
        name: Services.AUTH,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: parseInt(configService.get('REDIS_PORT')),
            password: configService.get('REDIS_PASSWORD'),
            retryAttempts: 5,
            retryDelay: 10000,
            keepAlive: 10000,
          },
        }),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
