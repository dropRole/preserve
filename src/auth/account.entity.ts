import { Complaint } from 'src/complaints/complaint.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Privilege } from './enum/privilege.enum';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  privilege: Privilege;

  @OneToMany((_type) => Complaint, (complaint) => complaint.account, {
    eager: false,
  })
  complaints: Complaint[];
}
