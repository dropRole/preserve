import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryColumn()
  idRequests: string;

  @Column()
  requestedBy: string;

  @Column()
  requestedAt: Timestamp;

  @Column()
  requestedFor: Timestamp;

  @Column()
  seats: number;

  @Column()
  cause: string;

  @Column()
  note: string = null;
}
