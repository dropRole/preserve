import { Account } from 'src/auth/account.entity';
import { Prohibition } from 'src/prohibitions/prohibitions.entity';
import { Request } from 'src/requests/request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('offerees')
export class Offeree {
  @PrimaryGeneratedColumn('uuid')
  idOfferees: string;

  @OneToOne((_type) => Account, { eager: false, onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  account: Account;

  @Column({ type: 'character varying', length: 60, nullable: true })
  email: string;

  @OneToMany((_type) => Request, (request) => request.offeree, { eager: false })
  @JoinColumn({ name: 'idRequests', referencedColumnName: 'idRequests' })
  requests: Request[];

  @OneToMany((_type) => Prohibition, (prohibition) => prohibition.offeree, {
    eager: false,
  })
  @JoinColumn({
    name: 'idProhibitions',
    referencedColumnName: 'idProhibitions',
  })
  prohibitions: Prohibition[];
}
