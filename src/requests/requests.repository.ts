import { UnauthorizedException } from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { Request } from './request.entity';

@EntityRepository(Request)
export class RequestsRepository extends Repository<Request> {
  async insertRequest(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    const { offeree, offeror, requestedAt, requestedFor, seats, cause, note } =
      requestForReservationDTO;
    const request = this.create({
      offeree,
      offeror,
      requestedAt,
      requestedFor,
      seats,
      cause,
      note,
    });
    try {
      // if insert query failed to execute
      await this.insert(request);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO requests VALUES(${offeror.idOfferors}, ${offeree.idOfferees}, ${requestedAt}, ${requestedFor}, ${seats}, ${cause}, ${note})`,
        [
          offeror.idOfferors,
          offeree.idOfferees,
          requestedAt,
          requestedFor,
          seats,
          cause,
          note,
        ],
        error.message,
      );
    }
    return request;
  }

  async selectRequests(
    account: Account,
    getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    const { todaysDate } = getRequestsFilterDTO;
    const query = this.createQueryBuilder('requests');
    query.where({ account });
    query.andWhere('requestedAt::DATE = :todaysDate', { todaysDate });
    try {
      // if select query failed to execute
      return await query.getMany();
    } catch (error) {
      throw new QueryFailedError(
        query.getSql(),
        [account, todaysDate],
        error.message,
      );
    }
  }

  async selectRequest(account: Account, idRequests: string): Promise<Request> {
    let request: Request;
    try {
      // if select query failed to execute
      request = await this.findOne({ idRequests });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM requests WHERE idRequest = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
    // if request wasn't sent by nor an account owner received it
    if (
      request.offeree.account !== account ||
      request.offeror.account !== account
    )
      throw new UnauthorizedException(
        "Request wasn't sent nor received by your account.",
      );
    return request;
  }

  async deleteRequest(idRequests: string): Promise<void> {
    try {
      await this.delete({ idRequests });
    } catch (error) {
      throw new QueryFailedError(
        `DELETE FROM requests WHERE idRequests = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
  }
}
