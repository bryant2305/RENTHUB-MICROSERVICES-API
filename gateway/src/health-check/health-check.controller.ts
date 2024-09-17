import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('microservices-healtchecks')
@Controller()
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get('healtcheck/properties')
  async getHealtStatusProperties() {
    try {
      const response = await this.healthCheckService.getHealtStatusProperties();
      return response;
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
  @Get('healtcheck/reservations')
  async getHealthStatusReservations() {
    try {
      const response =
        await this.healthCheckService.getHealtStatusReservations();
      return response;
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
  @Get('healtcheck/user-service')
  async getHealthStatusUserService() {
    try {
      const response =
        await this.healthCheckService.getHealtStatusUserService();
      return response;
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
  @Get('healtcheck/auth-service')
  async getHealthStatusAuthService() {
    try {
      const response =
        await this.healthCheckService.getHealtStatusAuthService();
      return response;
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
}
