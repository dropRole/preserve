import { UnauthorizedException } from '@nestjs/common';
import { Account } from '../auth/account.entity';
import { Offeree } from '../offerees/offeree.entity';
import { Offeror } from '../offerors/offeror.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { Request } from './request.entity';

@EntityRepository(Request)
export class RequestsRepository extends Repository<Request> {
  async insertRequest(
    offeror: Offeror,
    offeree: Offeree,
    requestedAt: string,
    requestedFor: string,
    seats: number,
    cause: string,
    note?: string,
  ): Promise<Request> {
    const query = this.createQueryBuilder('requests')
      .insert()
      .values([
        {
          offeror,
          offeree,
          requestedAt: () => `CAST('${requestedAt}' AS TIMESTAMP )`,
          requestedFor: () => `CAST('${requestedFor}' AS TIMESTAMP)`,
          seats,
          cause,
          note,
        },
      ]);
    try {
      // if insert query failed to execute
      await query.execute();
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
    return this.create({
      offeror,
      offeree,
      requestedAt,
      requestedFor,
      seats,
      cause,
      note,
    });
  }

  async selectRequests(
    account: Account,
    getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    const { todaysDate } = getRequestsFilterDTO;
    const query = this.createQueryBuilder('requests');
    query.addSelect('offerors.name')
    query.addSelect('offerors.address')
    query.innerJoin('requests.offeror', 'offerors');
    query.innerJoin('requests.offeree', 'offerees');
    query.where({ offeror: { account: { username: account.username } } });
    query.orWhere({ offeree: { account: { username: account.username } } });
    query.andWhere('requests."requestedAt"::DATE = :todaysDate', {
      todaysDate,
    });
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
      request = await this.findOne({ where: { idRequests } });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM requests WHERE idRequest = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
    // if request wasn't sent by nor an account owner received it
    if (
      request.offeree.account.username !== account.username &&
      request.offeror.account.username !== account.username
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
