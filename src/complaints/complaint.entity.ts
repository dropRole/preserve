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
  request: Request;

  @OneToOne((_type) => Account, (account) => account.complaints, {
    eager: true,
  })
  account: Account;

  @OneToOne((_type) => Complaint, (complaint) => complaint.counteredComplaint, {
    eager: false,
    nullable: true,
  })
  @JoinColumn()
  counteredComplaint: Complaint;

  @Column()
  content: string;

  @Column()
  written: string;

  @Column({ nullable: true })
  updated: string;
}
