import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class HealthCheckService {
  private readonly propertyService: any;
  private readonly reservationService: any;
  private readonly userService: any;
  private readonly authService: any;
  constructor(
    @Inject('PROPERTIES') private readonly propertyClient: ClientGrpc,
    @Inject('RESERVATIONS') private readonly reservationClient: ClientGrpc,
    @Inject('USER-SERVICE') private readonly userClient: ClientGrpc,
    @Inject('AUTH') private readonly authClient: ClientGrpc,
  ) {
    this.propertyService = this.propertyClient.getService('HealthCheckService');
    this.reservationService =
      this.reservationClient.getService('HealthCheckService');
    this.userService = this.userClient.getService('HealthCheckService');
    this.authService = this.authClient.getService('HealthCheckService');
  }
  async getHealtStatusProperties() {
    try {
      return await this.propertyService.getHealthStatus({});
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }

  async getHealtStatusReservations() {
    try {
      return await this.reservationService.getHealthStatus({});
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
  async getHealtStatusUserService() {
    try {
      return await this.userService.getHealthStatus({});
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
  async getHealtStatusAuthService() {
    try {
      return await this.authService.getHealthStatus({});
    } catch (error) {
      console.error('Error in gRPC service:', error);
      throw error;
    }
  }
}
