import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Request } from '../requests/request.entity';
import { Complaint } from '../complaints/complaint.entity';

@Entity('reservations')
export class Reservation {
  @OneToOne((_type) => Request, { primary: true, eager: true })
  @JoinColumn({
    name: 'idReservations',
    referencedColumnName: 'idRequests',
  })
  request: Request;

  @Column({ type: 'character varying', length: 8 })
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  confirmedAt: Date;

  @OneToMany((_type) => Complaint, (complaint) => complaint.reservation, {
    eager: false,
  })
  complaints: Complaint[];
}
