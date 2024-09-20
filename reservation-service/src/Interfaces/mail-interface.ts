import { Observable } from 'rxjs';

export interface MailServiceInterface {
  sendWelcomeEmail(data: UserInfo): Observable<UserInfoResponse>;
  sendReservationEmail(
    data: ReservationInfo,
  ): Observable<ReservationInfoResponse>;
}

export interface ReservationInfo {
  name: string;
  email: string;
  title: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface UserInfoResponse {
  error: boolean;
  message: string;
  user: UserInfo;
}

export interface ReservationInfoResponse {
  error: boolean;
  message: string;
  reservationInfo: ReservationInfo;
}
