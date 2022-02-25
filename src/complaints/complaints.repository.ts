import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@EntityRepository(Complaint)
export class ComplaintsRepository extends Repository<Complaint> {
  async insertComplaint(submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    const { idRequests, username, counteredTo, content, written } =
      submitComplaintDTO;
    const complaint = this.create({
      idRequests,
      username,
      counteredTo,
      content,
      written,
    });
    try {
      // if insert query failed
      await this.insert(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO complaints VALUES(${idRequests}, ${username}, ${counteredTo}, ${content}, ${written})`,
        undefined,
        error.message,
      );
    }
  }

  async selectComplaints(idReservations: string): Promise<Complaint[]> {
    const query = this.createQueryBuilder('complaints');
    query.where({ idRequests: idReservations });
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

  async updateComplaint(submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    const { idRequests, username, counteredTo, content, written } =
      submitComplaintDTO;
    const complaint = this.create({
      idRequests,
      username,
      counteredTo,
      content,
      written,
    });
    try {
      // if update query failed to execute
      await this.save(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO complaints VALUES(${idRequests}, ${username}, ${counteredTo}, ${content}, ${written})`,
        undefined,
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
