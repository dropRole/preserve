import { Account } from '../auth/account.entity';
import { Prohibition } from '../prohibitions/prohibitions.entity';
import { Request } from '../requests/request.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('offerors')
export class Offeror {
  @PrimaryGeneratedColumn('uuid')
  idOfferors: string;

  @Column({ type: 'character varying', length: 100 })
  name: string;

  @Column({ type: 'character varying', length: 80 })
  address: string;

  @Column({ type: 'character varying', length: 60 })
  email: string;

  @Column({ type: 'character varying', length: 13 })
  telephone: string;

  @Column({ type: 'text' })
  businessHours: string;

  @Column({ type: 'smallint' })
  @Check('responsiveness IN(5, 6, 7, 8, 9, 10)')
  responsiveness: number;

  @Column({ type: 'smallint' })
  @Check('compliance IN(5, 6, 7, 8, 9, 10)')
  compliance: number;

  @Column({ type: 'smallint' })
  @Check('timeliness IN(5, 6, 7, 8, 9, 10)')
  timeliness: number;

  @OneToOne((_type) => Account, { eager: true, onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  account: Account;

  @OneToMany((_type) => Request, (request) => request.offeror, { eager: false })
  @JoinColumn({ name: 'idRequests', referencedColumnName: 'idRequests' })
  requests: Request[];

  @OneToMany((_type) => Prohibition, (prohibition) => prohibition.offeror, {
    eager: false,
  })
  @JoinColumn({
    name: 'idProhibitions',
    referencedColumnName: 'idProhibitions',
  })
  prohibitions: Prohibition[];
}
