import { Account } from '../auth/account.entity';
import { Request } from '../requests/request.entity';
import {
  Brackets,
  EntityRepository,
  QueryFailedError,
  Repository,
} from 'typeorm';
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
      await this.insert(reservation);
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
    const query = this.createQueryBuilder('reservation');
    query.addSelect('request.idRequests');
    query.addSelect('requestedOfferor.name');
    query.addSelect('request.requestedFor');
    query.addSelect('request.seats');
    query.addSelect('request.cause');
    query.addSelect('request.note');
    query.addSelect('complaint.idComplaints');
    query.addSelect('complaintAuthor.username');
    query.addSelect('complaint.content');
    query.addSelect('complaint.written');
    query.addSelect('complaint.updated');
    query.addSelect('counteredComplaint.idComplaints');
    query.addSelect('counteredComplaintAuthor.username');
    query.addSelect('counteredComplaint.content');
    query.addSelect('counteredComplaint.written');
    query.addSelect('counteredComplaint.updated');
    query.innerJoin('reservation.request', 'request');
    query.leftJoin('reservation.complaints', 'complaint');
    query.leftJoin('complaint.account', 'complaintAuthor');
    query.leftJoin('complaint.counteredComplaint', 'counteredComplaint');
    query.leftJoin('counteredComplaint.account', 'counteredComplaintAuthor');
    query.innerJoin('request.offeror', 'requestedOfferor');
    query.innerJoin('request.offeree', 'requestantOfferee');
    query.innerJoin('requestedOfferor.account', 'requestedOfferorAccount');
    query.innerJoin('requestantOfferee.account', 'requestantOffereeAccount');
    query.where('reservation."confirmedAt"::DATE = :todaysDate', {
      todaysDate,
    });
    query.andWhere(
      new Brackets((query) => {
        query
          .where('requestedOfferorAccount.username = :username', {
            username: `${account.username}`,
          })
          .orWhere('requestantOffereeAccount.username = :username', {
            username: `${account.username}`,
          });
      }),
    );
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
