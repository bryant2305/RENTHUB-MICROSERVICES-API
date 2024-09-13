import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error?.status || HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: error?.message || 'Internal Server Errorss', // Obtén el mensaje de error de la excepción RpcException
    });
  }
}
