import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prohibitions')
export class Prohibition {
  @PrimaryGeneratedColumn('uuid')
  idProhibitons: string;

  @Column()
  idOfferors: string;

  @Column()
  idOfferees: string;

  @Column()
  beginning: string;

  @Column()
  conclusion: string;

  @Column()
  cause: string;
}
