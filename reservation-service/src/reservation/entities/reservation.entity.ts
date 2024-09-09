import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  propertyId: string;

  @Column()
  userId: number;

  @Column()
  checkIn: Date;

  @Column()
  checkOut: Date;
}
