import { UnauthorizedException } from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { Request } from 'src/requests/request.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {
  async insertReservation(
    makeReservationDTO: MakeReservationDTO,
  ): Promise<void> {
    const { request, code, confirmedAt } = makeReservationDTO;
    const reservation = this.create({ request, code, confirmedAt });
    try {
      // if insert query failed
      await this.save(reservation);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO reservations VALUES(${request.idRequests}, ${code}, ${confirmedAt})`,
        [request.idRequests, code, confirmedAt],
        error.message,
      );
    }
  }

  async selectReservations(
    getReservationFilterDTO: GetReservationsFilterDTO,
    requests: Request[],
  ): Promise<Reservation[]> {
    const query = this.createQueryBuilder('reservations');
    const { todaysDate } = getReservationFilterDTO;
    query.where('reservations.confirmedAt::DATE === :todaysDate', {
      todaysDate,
    });
    query.andWhere('reservation.request IN(:requests)', { requests });
    try {
      // if select query failed
      return await query.getMany();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [requests], error.message);
    }
  }

  async selectReservation(
    account: Account,
    idRequests: string,
  ): Promise<Reservation> {
    let reservation: Reservation;
    try {
      // if select query failed
      reservation = await this.findOne({ idReservations: idRequests });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM reservations WHERE idRequests = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
    // if reservation wasn't made nor received by the given account nor admin owns the account
    if (
      reservation.request.offeree.account !== account ||
      reservation.request.offeree.account !== account ||
      account.privilege !== Privilege.Admin
    )
      throw new UnauthorizedException(
        'Reservation is not related with your account.',
      );
    return reservation;
  }

  async deleteReservation(idRequests: string): Promise<void> {
    try {
      // if delete query failed to execute
      await this.delete(idRequests);
    } catch (error) {
      throw new QueryFailedError(
        `DELETE FROM reservations WHERE idRequests = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
  }
}
