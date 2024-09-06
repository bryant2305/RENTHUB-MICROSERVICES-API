import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PropertyAvailability {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  propertyId: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
