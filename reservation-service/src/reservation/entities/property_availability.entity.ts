import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PropertyAvailability {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  propertyId: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
