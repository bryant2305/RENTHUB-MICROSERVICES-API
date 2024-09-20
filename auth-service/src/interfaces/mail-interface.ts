import { Observable } from 'rxjs';

export interface MailServiceInterface {
  sendWelcomeEmail(data: UserInfo): Observable<UserInfoResponse>;
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
