import { UnauthorizedException } from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { Request } from 'src/requests/request.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { Reservation } from './reservation.entity';
import { v4 as uuid } from 'uuid';

@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> {
  async insertReservation(request: Request): Promise<void> {
    const code = uuid().substring(0, 8);
    const reservation = this.create({
      request,
      code,
    });
    try {
      // if insert query failed
      await this.save(reservation);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO reservations VALUES(${request.idRequests}, ${code}, DEFAULT)`,
        [request.idRequests, code],
        error.message,
      );
    }
  }

  async selectReservations(
    account: Account,
    getReservationFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    const { todaysDate } = getReservationFilterDTO;
    const query = this.createQueryBuilder('reservations');
    query.innerJoin('reservations.request', 'requests');
    query.innerJoin('requests.offeror', 'offerors');
    query.where('reservations."confirmedAt"::DATE = :todaysDate', {
      todaysDate,
    });
    query.andWhere({ request: { offeror: { account } } });
    try {
      // if select query failed
      return await query.getMany();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [account], error.message);
    }
  }

  async selectReservation(
    account: Account,
    idRequests: string,
  ): Promise<Reservation> {
    let reservation: Reservation;
    try {
      // if select query failed
      reservation = await this.findOne({ request: { idRequests } });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM reservations WHERE idReservations = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
    // if reservation hasn't been made
    if (typeof reservation === 'undefined') return undefined;
    // if reservation wasn't made nor received by the given account nor admin owns the account
    if (
      account.privilege !== Privilege.Admin &&
      reservation.request.offeree.account.username !== account.username &&
      reservation.request.offeror.account.username !== account.username
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
