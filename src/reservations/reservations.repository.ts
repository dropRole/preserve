import { EntityRepository, Repository } from 'typeorm';
import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {}
