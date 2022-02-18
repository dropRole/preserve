import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { ComplainDTO } from './dto/complain.dto';

@EntityRepository(Complaint)
export class ComplaintsRepository extends Repository<Complaint> {
  async insertComplaint(complainDTO: ComplainDTO): Promise<void> {
    const { idRequests, username, counteredTo, content, written } = complainDTO;
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
        'postgres',
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
        'postgresql',
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
      throw new QueryFailedError(query.getSql(), [counteredTo], 'postgresql');
    }
  }

  async updateComplaint(complainDTO: ComplainDTO): Promise<void> {
    const { idRequests, username, counteredTo, content, written } = complainDTO;
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
        'postgres',
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
        'postgres',
      );
    }
  }
}
