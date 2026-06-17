import {
  Catch,
  ArgumentsHost,
  HttpException,
  RpcExceptionFilter as BaseRpcExceptionFilter,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * HttpToRpcExceptionFilter
 * Catches standard NestJS HttpExceptions and repackages them as gRPC RpcExceptions.
 * This ensures that HTTP-level errors (validation errors, auth errors, etc.)
 * are properly translated to the gRPC protocol used by backend microservices.
 */
@Catch(HttpException)
export class HttpToRpcExceptionFilter
  implements BaseRpcExceptionFilter<HttpException>
{
  private readonly logger = new Logger(HttpToRpcExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error details from the exception
    let message = 'Internal server error';
    let errorDetails: any = {};

    if (typeof exceptionResponse === 'object') {
      const response = exceptionResponse as any;
      message = response.message || response.error || 'Internal server error';
      errorDetails = response;
    } else {
      message = exceptionResponse as string;
    }

    // Log the error for debugging
    this.logger.error(
      `HttpException caught and translated to RpcException: ${message}`,
      exception.stack,
    );

    // Create RpcException with the error details
    // The error code maps HTTP status to gRPC codes
    const rpcException = new RpcException({
      code: this.mapHttpStatusToGrpcCode(status),
      message,
      details: errorDetails,
      statusCode: status,
    });

    throw rpcException;
  }

  /**
   * Maps HTTP status codes to gRPC error codes
   * Reference: https://grpc.io/docs/guides/status-codes/
   */
  private mapHttpStatusToGrpcCode(httpStatus: number): number {
    const statusMap: { [key: number]: number } = {
      400: 3, // INVALID_ARGUMENT
      401: 16, // UNAUTHENTICATED
      403: 7, // PERMISSION_DENIED
      404: 5, // NOT_FOUND
      409: 6, // ALREADY_EXISTS
      422: 3, // INVALID_ARGUMENT
      429: 8, // RESOURCE_EXHAUSTED
      500: 13, // INTERNAL
      501: 12, // UNIMPLEMENTED
      503: 14, // UNAVAILABLE
    };

    return statusMap[httpStatus] || 13; // Default to INTERNAL (13)
  }
}
