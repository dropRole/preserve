import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  idRequests: string;

  @Column()
  idOfferors: string;

  @Column()
  idOfferees: string;

  @Column()
  requestedAt: string;

  @Column()
  requestedFor: string;

  @Column()
  seats: number;

  @Column()
  cause: string;

  @Column()
  note: string = null;
}
