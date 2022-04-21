import { Offeree } from 'src/offerees/offeree.entity';
import { Offeror } from 'src/offerors/offeror.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prohibitions')
export class Prohibition {
  @PrimaryGeneratedColumn('uuid')
  idProhibitions: string;

  @ManyToOne((_type) => Offeror, (offeree) => offeree.prohibitions, {
    eager: false,
  })
  offeror: Offeror;

  @ManyToOne((_type) => Offeree, (offeror) => offeror.prohibitions, {
    eager: false,
  })
  offeree: Offeree;

  @Column({ type: 'timestamp' })
  beginning: Date;

  @Column({ type: 'timestamp' })
  conclusion: Date;

  @Column({ type: 'text' })
  cause: string;
}
