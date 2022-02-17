import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryColumn()
  id_requests: string;

  @Column()
  code: string;

  @Column()
  confirmed_at: Timestamp;
}
