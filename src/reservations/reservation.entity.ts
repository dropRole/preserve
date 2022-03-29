import { Column, Entity, OneToOne } from 'typeorm';
import { Request } from 'src/requests/request.entity';

@Entity('reservations')
export class Reservation {
  @OneToOne((_type) => Request, { eager: true })
  request: Request;

  @Column()
  code: string;

  @Column()
  confirmedAt: string;
}
