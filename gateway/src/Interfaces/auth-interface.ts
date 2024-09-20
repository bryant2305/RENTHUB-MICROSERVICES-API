// properties-types.ts

import { Observable } from 'rxjs';

// Define interfaces based on your .proto messages

export interface AuthServiceInterface {
  login(data: AuthRequest): Observable<AuthResponse>;
  register(data: CreateUser): Observable<CreateUserResponse>;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  error: boolean;
  message: string;
  user: User;
}

// User data structure
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Register/CreateUser request
export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  error: boolean;
  message: string;
  user: User;
}

// Empty message (for health check or other simple requests)
export interface Empty {}
