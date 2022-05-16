import { Complaint } from '../complaints/complaint.entity';
import { Check, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Privilege } from './enum/privilege.enum';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ type: 'character varying', length: 20, unique: true })
  username: string;

  @Column({ type: 'character varying', length: 64 })
  password: string;

  @Column({ type: 'character varying' })
  @Check("privilege IN('Admin', 'Offeror', 'Offeree')")
  privilege: Privilege;

  @OneToMany((_type) => Complaint, (complaint) => complaint.account, {
    eager: false,
  })
  complaints: Complaint[];
}
