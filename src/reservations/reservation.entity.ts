import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  idRequests: string;

  @Column()
  code: string;

  @Column()
  confirmedAt: string;
}
