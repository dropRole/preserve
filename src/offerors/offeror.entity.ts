import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('offerors')
export class Offeror {
  @PrimaryColumn()
  idOfferors: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  telephone: string;

  @Column()
  businessHours: string;

  @Column()
  responsiveness: number;

  @Column()
  compliance: number;

  @Column()
  timeliness: number;
}
