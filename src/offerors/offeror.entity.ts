import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('offerors')
export class Offeror {
  @PrimaryColumn()
  id_offerors: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  telephone: string;

  @Column()
  business_hours: string;

  @Column()
  responsiveness: number;

  @Column()
  compliance: number;

  @Column()
  timeliness: number;
}
