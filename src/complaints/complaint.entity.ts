import { Account } from '../auth/account.entity';
import { Reservation } from '../reservations/reservation.entity';
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
  })
  reservation: Reservation;

  @ManyToOne((_type) => Account, (account) => account.complaints, {
    eager: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  account: Account;

  @OneToOne((_type) => Complaint, (complaint) => complaint.idComplaints, {
    eager: false,
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'counteredComplaint',
    referencedColumnName: 'idComplaints',
  })
  counteredComplaint: Complaint;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  written: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated: Date;
}
