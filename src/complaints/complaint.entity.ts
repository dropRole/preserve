import { Account } from 'src/auth/account.entity';
import { Request } from 'src/requests/request.entity';
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

  @ManyToOne((_type) => Request, (request) => request.complaints, {
    eager: false,
  })
  @JoinColumn({ name: 'idRequests', referencedColumnName: 'idRequests' })
  request: Request;

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

  @Column({ type: 'timestamp' })
  written: string;

  @Column({ type: 'timestamp', nullable: true })
  updated: string;
}
