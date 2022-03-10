import { Complaint } from 'src/complaints/complaint.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Complaint, (complaint) => complaint.account, {
    eager: false,
  })
  complaints: Complaint[];
}
