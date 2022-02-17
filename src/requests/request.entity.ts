import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryColumn()
  id_requests: string;

  @Column()
  requested_by: string;

  @Column()
  submitted_at: Timestamp;

  @Column()
  requested_for: Timestamp;

  @Column()
  seats: number;

  @Column()
  cause: string;

  @Column()
  note: string = null;
}
