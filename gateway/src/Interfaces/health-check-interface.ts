import { Observable } from 'rxjs';

export interface Empty {}

export interface HealthCheckServiceInterface {
  getHealthStatus(data: Empty): Observable<HealthCheckResponse>;
}

export interface HealthCheckResponse {
  status: boolean;
}
