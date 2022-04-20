import { Account } from 'src/auth/account.entity';
import { Reservation } from 'src/reservations/reservation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  idComplaints: string;

  @ManyToOne((_type) => Reservation, (reservation) => reservation.complaints, {
    eager: false,
  })
  @JoinColumn({
    name: 'idReservations',
    referencedColumnName: 'idReservations',
  })
  reservation: Reservation;

  @OneToOne((_type) => Account, (account) => account.complaints, {
    eager: true,
  })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  account: Account;

  @OneToOne((_type) => Complaint, (complaint) => complaint.counteredComplaint, {
    eager: false,
    nullable: true,
  })
  @JoinColumn({
    name: 'idCounteredComplaints',
    referencedColumnName: 'idComplaints',
  })
  counteredComplaint: Complaint;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: 'now' })
  written: string;

  @Column({ type: 'timestamp', nullable: true })
  updated: string;
}
