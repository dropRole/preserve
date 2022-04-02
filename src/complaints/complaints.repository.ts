import { Account } from 'src/auth/account.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@EntityRepository(Complaint)
export class ComplaintsRepository extends Repository<Complaint> {
  async insertComplaint(
    submitComplaintDTO: SubmitComplaintDTO,
    account: Account,
  ): Promise<void> {
    const { request, counteredComplaint, content, written } =
      submitComplaintDTO;
    const complaint = this.create({
      request,
      account,
      counteredComplaint,
      content,
      written,
    });
    try {
      // if insert query failed
      await this.insert(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO complaints VALUES(${request.idRequests}, ${account.username}, ${counteredComplaint.idComplaints}, ${content}, ${written})`,
        undefined,
        error.message,
      );
    }
  }

  async selectComplaints(
    idReservations: string,
    account: Account,
  ): Promise<Complaint[]> {
    const query = this.createQueryBuilder('complaints');
    query.where({ idRequests: idReservations });
    query.andWhere('complaint.username = :username', {
      username: account.username,
    });
    query.orWhere(
      'complaint.counteredTo IN (SELECT idComplaints FROM complaints WHERE username = :username)',
      { username: account.username },
    );
    try {
      return await query.getMany();
    } catch (error) {
      // if select query failed to execute
      throw new QueryFailedError(
        query.getSql(),
        [idReservations],
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

  async updateComplaint(
    reSubmitComplaintDTO: ReSubmitComplaintDTO,
  ): Promise<void> {
    const { idComplaints, content } = reSubmitComplaintDTO;
    const complaint = await this.findOne({ idComplaints });
    const updated = (+new Date()).toString();
    complaint.content = content;
    complaint.updated = updated;
    try {
      // if update query failed to execute
      await this.save(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE complaints SET content = ${content} WHERE idComplaints = ${idComplaints}`,
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
