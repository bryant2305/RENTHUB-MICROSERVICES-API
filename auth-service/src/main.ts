import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { HttpToRpcExceptionFilter } from './common/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const url = configService.get<number>('URL');

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth_proto',
      protoPath: join(__dirname, '../src/shared/protos/auth.proto'),
      url: `${url}:${port}`,
    },
  });

  // Apply global exception filter to translate HTTP exceptions to RPC exceptions
  app.useGlobalFilters(new HttpToRpcExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Extract validation error messages
        const messages = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : ['Unknown validation error'];
          return `${error.property}: ${constraints.join(', ')}`;
        });

        // Throw RpcException with validation errors
        return new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: 'Validation failed',
          details: {
            statusCode: 400,
            message: 'Validation failed',
            errors: messages,
          },
          statusCode: 400,
        });
      },
    }),
  );

  await app.startAllMicroservices();
  // await app.listen(port);
}

bootstrap();
