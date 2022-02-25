import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {
  async insertReservation(
    makeReservationDTO: MakeReservationDTO,
  ): Promise<void> {
    const { idRequests, code, confirmedAt } = makeReservationDTO;
    const reservation = this.create({ idRequests, code, confirmedAt });
    try {
      // if insert query failed
      await this.save(reservation);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO reservations VALUES(${idRequests}, ${code}, ${confirmedAt})`,
        [idRequests, code, confirmedAt],
        error.message,
      );
    }
  }

  /* async selectReservations(
    getReservationFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    
  } */

  async selectReservation(idRequests: string): Promise<Reservation> {
    try {
      // if select query failed
      return await this.findOne({ idRequests });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM reservations WHERE idRequests = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
  }

  async deleteReservation(idRequests: string): Promise<void> {
    try {
      // if delete query failed to execute
      await this.delete({ idRequests });
    } catch (error) {
      throw new QueryFailedError(
        `DELETE FROM reservations WHERE idRequests = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
  }
}
