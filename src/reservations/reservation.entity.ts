import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from 'src/requests/request.entity';
import { Complaint } from 'src/complaints/complaint.entity';

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
  confirmedAt: Date;

  @OneToMany((_type) => Complaint, (complaint) => complaint.reservation, {
    eager: false,
  })
  complaints: Complaint[];
}
