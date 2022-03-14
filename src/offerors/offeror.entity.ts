import { Account } from 'src/auth/account.entity';
import { Prohibition } from 'src/prohibitions/prohibitions.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('offerors')
export class Offeror {
  @PrimaryGeneratedColumn('uuid')
  idOfferors: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  telephone: string;

  @Column()
  businessHours: string;

  @Column()
  responsiveness: number;

  @Column()
  compliance: number;

  @Column()
  timeliness: number;

  @OneToOne((_type) => Account, { eager: true })
  account: Account;

  @OneToMany((_type) => Prohibition, (prohibition) => prohibition.offeror, {
    eager: true,
  })
  prohibitions: Prohibition[];
}
