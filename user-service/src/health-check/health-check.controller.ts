import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class HealthCheckController {
  @GrpcMethod('HealthCheckService', 'getHealthStatus')
  healthCheck() {
    return { status: true };
  }
}
