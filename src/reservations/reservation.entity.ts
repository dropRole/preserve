import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from 'src/requests/request.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  idReservations: string;

  @OneToOne((_type) => Request, { eager: true })
  @JoinColumn({ name: 'idRequests', referencedColumnName: 'idRequests' })
  request: Request;

  @Column({ type: 'character varying', length: 8 })
  code: string;

  @Column({ type: 'timestamp', default: 'NOW' })
  confirmedAt: string;
}
