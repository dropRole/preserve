import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('offerees')
export class Offeree {
  @PrimaryGeneratedColumn('uuid')
  idOfferees: string;

  @Column()
  username: string;

  @Column()
  email: string;
}
