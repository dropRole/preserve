import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  password: string;
}
