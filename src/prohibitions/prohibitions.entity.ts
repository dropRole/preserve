import { Offeree } from '../offerees/offeree.entity';
import { Offeror } from '../offerors/offeror.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('prohibitions')
export class Prohibition {
  @PrimaryGeneratedColumn('uuid')
  idProhibitions: string;

  @ManyToOne((_type) => Offeror, (offeree) => offeree.prohibitions, {
    eager: false,
  })
  @JoinColumn({ name: 'idOfferors', referencedColumnName: 'idOfferors' })
  offeror: Offeror;

  @ManyToOne((_type) => Offeree, (offeree) => offeree.prohibitions, {
    eager: false,
  })
  @JoinColumn({ name: 'idOfferees', referencedColumnName: 'idOfferees' })
  offeree: Offeree;

  @Column({ type: 'timestamp' })
  beginning: Date;

  @Column({ type: 'timestamp' })
  conclusion: Date;

  @Column({ type: 'text' })
  cause: string;
}
