import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryColumn()
  idReservations: string;

  @Column()
  code: string;

  @Column()
  confirmedAt: Timestamp;
}
