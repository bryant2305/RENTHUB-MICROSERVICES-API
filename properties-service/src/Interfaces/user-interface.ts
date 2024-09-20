import { Observable } from 'rxjs';

export interface UserServiceInterface {
  getUserById(data: GetUserByIdRequest): Observable<GetUserByIdResponse>;
  getUserByEmail(data: GetUserByEmail): Observable<GetUserByEmailResponse>;
  createUser(data: CreateUser): Observable<CreateUserResponse>;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  error: boolean;
  message: string;
  user: User;
}

export interface GetUserByIdRequest {
  id: number;
}

export interface GetUserByIdResponse {
  id: number;
  name: string;
  email: string;
}

export interface GetUserByEmail {
  email: string;
}

export interface GetUserByEmailResponse {
  id: number;
  name: string;
  email: string;
  password: string;
}
