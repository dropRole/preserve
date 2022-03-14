import { Account } from 'src/auth/account.entity';
import { Prohibition } from 'src/prohibitions/prohibitions.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('offerees')
export class Offeree {
  @PrimaryGeneratedColumn('uuid')
  idOfferees: string;

  @OneToOne((_type) => Account, { eager: true })
  account: Account;

  @Column()
  email: string;

  @OneToMany((_type) => Prohibition, (prohibition) => prohibition.offeree, {
    eager: false,
  })
  prohibitions: Prohibition[];
}
