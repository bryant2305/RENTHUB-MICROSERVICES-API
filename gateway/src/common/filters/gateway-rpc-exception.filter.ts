import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

/**
 * GatewayRpcExceptionFilter
 * Catches RpcExceptions coming from gRPC microservices and translates them
 * back into standard HTTP responses with appropriate status codes and error details.
 * This provides a seamless experience for API clients consuming the gateway.
 */
@Catch(RpcException)
export class GatewayRpcExceptionFilter {
  private readonly logger = new Logger(GatewayRpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Extract error details from the RpcException
    const error = exception.getError() as any;

    // Log the raw error for debugging
    this.logger.error(
      `RpcException caught from microservice: ${JSON.stringify(error)}`,
      exception.stack,
    );

    // Extract status code, message, and error details
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = {};

    if (typeof error === 'object') {
      // Error object with details
      statusCode =
        error.statusCode || error.code || HttpStatus.INTERNAL_SERVER_ERROR;
      message = error.message || 'Internal server error';
      errorDetails = error.details || {};

      // Map gRPC codes to HTTP status codes if gRPC code is present
      if (error.code && !error.statusCode) {
        statusCode = this.mapGrpcCodeToHttpStatus(error.code);
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    // Return standard HTTP error response
    return response.status(statusCode).json({
      statusCode,
      message,
      error: errorDetails,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Maps gRPC error codes to HTTP status codes
   * Reference: https://grpc.io/docs/guides/status-codes/
   */
  private mapGrpcCodeToHttpStatus(grpcCode: number): number {
    const codeMap: { [key: number]: number } = {
      0: HttpStatus.OK, // OK
      1: HttpStatus.INTERNAL_SERVER_ERROR, // CANCELLED
      2: HttpStatus.INTERNAL_SERVER_ERROR, // UNKNOWN
      3: HttpStatus.BAD_REQUEST, // INVALID_ARGUMENT
      4: HttpStatus.INTERNAL_SERVER_ERROR, // DEADLINE_EXCEEDED
      5: HttpStatus.NOT_FOUND, // NOT_FOUND
      6: HttpStatus.CONFLICT, // ALREADY_EXISTS
      7: HttpStatus.FORBIDDEN, // PERMISSION_DENIED
      8: HttpStatus.TOO_MANY_REQUESTS, // RESOURCE_EXHAUSTED
      9: HttpStatus.BAD_REQUEST, // FAILED_PRECONDITION
      10: HttpStatus.CONFLICT, // ABORTED
      11: HttpStatus.BAD_REQUEST, // OUT_OF_RANGE
      12: HttpStatus.NOT_IMPLEMENTED, // UNIMPLEMENTED
      13: HttpStatus.INTERNAL_SERVER_ERROR, // INTERNAL
      14: HttpStatus.SERVICE_UNAVAILABLE, // UNAVAILABLE
      15: HttpStatus.INTERNAL_SERVER_ERROR, // DATA_LOSS
      16: HttpStatus.UNAUTHORIZED, // UNAUTHENTICATED
    };

    return codeMap[grpcCode] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
