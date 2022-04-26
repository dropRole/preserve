import { Account } from 'src/auth/account.entity';
import { Reservation } from 'src/reservations/reservation.entity';
import {
  EntityRepository,
  QueryFailedError,
  Repository,
  Timestamp,
} from 'typeorm';
import { Complaint } from './complaint.entity';

@EntityRepository(Complaint)
export class ComplaintsRepository extends Repository<Complaint> {
  async insertComplaint(
    reservation: Reservation,
    counteredComplaint: Complaint,
    content: string,
    account: Account,
  ): Promise<void> {
    const complaint = this.create({
      reservation,
      counteredComplaint,
      account,
      content,
    });
    try {
      // if insert query failed
      await this.insert(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO complaints VALUES(${reservation.request.idRequests}, ${account.username}, ${counteredComplaint.idComplaints}, ${content}, NOW())`,
        undefined,
        error.message,
      );
    }
  }

  async selectComplaints(
    reservation: Reservation,
    account: Account,
  ): Promise<Complaint[]> {
    const query = this.createQueryBuilder('complaints');
    query.innerJoin('complaints.reservation', 'reservations');
    query.innerJoin('reservations.request', 'requests');
    query.innerJoin('requests.offeror', 'offerors');
    query.where({ reservation });
    query.andWhere(
      '(complaints.username = :authorUsername OR offerors.username = :offerorsUsername)',
      {
        authorUsername: account.username,
        offerorsUsername: reservation.request.offeror.account.username,
      },
    );
    try {
      return await query.getMany();
    } catch (error) {
      // if select query failed to execute
      throw new QueryFailedError(
        query.getSql(),
        [reservation.request.idRequests],
        error.message,
      );
    }
  }

  async selectCounterComplaints(counteredTo: string): Promise<Complaint[]> {
    const query = this.createQueryBuilder('complaints');
    query.where({ idComplaints: counteredTo });
    try {
      return await query.getMany();
    } catch (error) {
      // if select query failed to execute
      throw new QueryFailedError(query.getSql(), [counteredTo], error.message);
    }
  }

  async updateComplaint(idComplaints: string, content: string): Promise<void> {
    const complaint = await this.findOne({ idComplaints });
    complaint.content = content;
    complaint.updated = new Date();
    try {
      // if update query failed to execute
      await this.save(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE complaints SET content = ${content}, updated = NOW() WHERE idComplaints = ${idComplaints}`,
        [content, idComplaints],
        error.message,
      );
    }
  }

  async deleteComplaint(idComplaints: string): Promise<void> {
    try {
      // if delete query failed to execute
      this.delete({ idComplaints });
    } catch (error) {
      throw new QueryFailedError(
        `DELETE FROM complaints WHERE idComplaints = ${idComplaints}`,
        [idComplaints],
        error.message,
      );
    }
  }
}
