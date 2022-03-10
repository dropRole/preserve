import { Account } from 'src/auth/account.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('offerees')
export class Offeree {
  @PrimaryGeneratedColumn('uuid')
  idOfferees: string;

  @OneToOne((_type) => Account, account.offeree, { eager: true })
  account: Account;

  @Column()
  email: string;
}
