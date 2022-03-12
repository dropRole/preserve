import { Complaint } from 'src/complaints/complaint.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Role } from './enum/role.enum';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  privilege: Role;

  @OneToMany((_type) => Complaint, (complaint) => complaint.account, {
    eager: false,
  })
  complaints: Complaint[];
}
