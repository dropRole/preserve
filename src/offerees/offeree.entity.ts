import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('offerees')
export class Offeree {
  @PrimaryGeneratedColumn('uuid')
  idOfferees: string;

  @Column()
  username: string;

  @Column()
  email: string;
}
