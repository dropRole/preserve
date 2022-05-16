import { Offeree } from '../offerees/offeree.entity';
import { Offeror } from '../offerors/offeror.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  idRequests: string;

  @ManyToOne((_type) => Offeror, (offeror) => offeror.requests, {
    eager: true,
  })
  @JoinColumn({ name: 'idOfferors', referencedColumnName: 'idOfferors' })
  offeror: Offeror;

  @ManyToOne((_type) => Offeree, (offeree) => offeree.requests, { eager: true })
  @JoinColumn({ name: 'idOfferees', referencedColumnName: 'idOfferees' })
  offeree: Offeree;

  @Column({ type: 'timestamp' })
  requestedAt: Date;

  @Column({ type: 'timestamp' })
  requestedFor: Date;

  @Column({ type: 'smallint' })
  seats: number;

  @Column({ type: 'text' })
  cause: string;

  @Column({ type: 'text', nullable: true })
  note: string;
}
