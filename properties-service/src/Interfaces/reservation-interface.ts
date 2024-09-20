import { Observable } from 'rxjs';

export interface ReservationServiceInterface {
  createReservation(data: CreateReservation): Observable<ReservationResponse>;
  findReservation(data: ReservationById): Observable<FindReservationResponse>;
  cancelReservation(data: ReservationById): Observable<ReservationResponse>;
  findReservationByPropertyId(data: PropertyById): Observable<PropertyResponse>;
}

export interface ReservationById {
  id: number;
}

export interface PropertyById {
  propertyId: string;
}

export interface PropertyResponse {
  propertyId: string;
  error: boolean;
  message: string;
}

export interface CreateReservation {
  propertyId: string;
  userId: number;
  checkIn: Date;
  checkOut: Date;
}

export interface ReservationResponse {
  error: boolean;
  message: string;
  reservation?: Reservation;
}

export interface Reservation {
  propertyId: string;
  userId: number;
  checkIn: string;
  checkOut: string;
}

export interface FindReservationResponse {
  propertyId: string;
  userId: number;
  checkIn: string;
  checkOut: string;
  error: boolean;
  message: string;
}
