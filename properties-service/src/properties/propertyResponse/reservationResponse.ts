export interface ReservationResponse {
  propertyId: string;
  userId?: string;
  checkIn?: Date;
  checkOut?: Date;
  error: boolean;
  message: string;
}
