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
  @JoinColumn()
  request: Request;

  @Column()
  code: string;

  @Column()
  confirmedAt: string;
}
