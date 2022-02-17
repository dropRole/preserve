import { InternalServerErrorException, Query } from '@nestjs/common';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { ComplainDTO } from './dto/complain.dto';

@EntityRepository(Complaint)
export class ComplaintsRepository extends Repository<Complaint> {
  async insertComplaint(complainDTO: ComplainDTO): Promise<void> {
    const { id_requests, username, countered_to, content, written } =
      complainDTO;
    const complaint = this.create({
      id_requests,
      username,
      countered_to,
      content,
      written,
    });
    try {
      // if insert query failed
      await this.insert(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO complaints VALUES(${id_requests}, ${username}, ${countered_to}, ${content}, ${written})`,
        undefined,
        'postgres',
      );
    }
  }

  async selectComplaints(id_reservations: string): Promise<Complaint[]> {
    const query = this.createQueryBuilder('complaints');
    query.where({ id_requests: id_reservations });
    try {
      return await query.getMany();
    } catch (error) {
      // if select query failed to execute
      throw new QueryFailedError(
        query.getSql(),
        [id_reservations],
        'postgresql',
      );
    }
  }

  async selectCounterComplaints(countered_to: string): Promise<Complaint[]> {
    const query = this.createQueryBuilder('complaints');
    query.where({ id_complaints: countered_to });
    try {
      return await query.getMany();
    } catch (error) {
      // if select query failed to execute
      throw new QueryFailedError(query.getSql(), [countered_to], 'postgresql');
    }
  }

  async updateComplaint(complainDTO: ComplainDTO): Promise<void> {
    const { id_requests, username, countered_to, content, written } =
      complainDTO;
    const complaint = this.create({
      id_requests,
      username,
      countered_to,
      content,
      written,
    });
    try {
      // if update query failed to execute
      await this.save(complaint);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO complaints VALUES(${id_requests}, ${username}, ${countered_to}, ${content}, ${written})`,
        undefined,
        'postgres',
      );
    }
  }

  async deleteComplaint(id_complaints: string): Promise<void> {
    try {
      // if delete query failed to execute
      this.delete({ id_complaints });
    } catch (error) {
      throw new QueryFailedError(
        `DELETE FROM complaints WHERE id_complaints = ${id_complaints}`,
        [id_complaints],
        'postgres',
      );
    }
  }
}
