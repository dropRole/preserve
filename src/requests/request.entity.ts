import { Complaint } from 'src/complaints/complaint.entity';
import { Offeree } from 'src/offerees/offeree.entity';
import { Offeror } from 'src/offerors/offeror.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  idRequests: string;

  @ManyToOne((_type) => Offeror, (offeror) => offeror.request, { eager: false })
  offeror: Offeror;

  @ManyToOne((_type) => Offeree, (offeree) => offeree.requests, { eager: true })
  offeree: Offeree;

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

  @OneToMany((_type) => Complaint, (complaint) => complaint.request, {
    eager: false,
  })
  complaints: Complaint[];
}
