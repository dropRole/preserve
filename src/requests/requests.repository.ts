import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { Request } from './request.entity';

@EntityRepository(Request)
export class RequestsRepository extends Repository<Request> {
  async insertRequest(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    const {
      idOfferors,
      idOfferees,
      requestedAt,
      requestedFor,
      seats,
      cause,
      note,
    } = requestForReservationDTO;
    const request = this.create({
      idOfferors,
      idOfferees,
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
        `INSERT INTO requests VALUES(${idOfferors}, ${idOfferees}, ${requestedAt}, ${requestedFor}, ${seats}, ${cause}, ${note})`,
        [idOfferors, idOfferees, requestedAt, requestedFor, seats, cause, note],
        error.message,
      );
    }
    return request;
  }

  async selectRequests(
    getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    const { idOfferors, todaysDate } = getRequestsFilterDTO;
    const query = this.createQueryBuilder('requests');
    query.where({ idOfferors });
    query.andWhere('requestedAt::DATE = :todaysDate', { todaysDate });
    try {
      // if select query failed to execute
      return await query.getMany();
    } catch (error) {
      throw new QueryFailedError(
        query.getSql(),
        [idOfferors, todaysDate],
        error.message,
      );
    }
  }

  async selectRequest(idRequests: string): Promise<Request> {
    try {
      // if select query failed to execute
      return await this.findOne({ idRequests });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM requests WHERE idRequest = ${idRequests}`,
        [idRequests],
        error.message,
      );
    }
  }

  async deleteRequest(idRequests: string): Promise<void> {
    
  }
}
