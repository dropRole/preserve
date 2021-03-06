import { ConflictException } from '@nestjs/common';
import { Offeree } from '../offerees/offeree.entity';
import { Offeror } from '../offerors/offeror.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateProhibitionTimeframeDTO } from './dto/update-prohibition-timeframe.dto';
import { Prohibition } from './prohibitions.entity';

@EntityRepository(Prohibition)
export class ProhibitionsRepository extends Repository<Prohibition> {
  async insertProhibition(
    offeror: Offeror,
    offeree: Offeree,
    beginning: string,
    conclusion: string,
    cause: string,
  ): Promise<void> {
    const prohibition = this.create({
      offeror,
      offeree,
      beginning: new Date(beginning),
      conclusion: new Date(conclusion),
      cause,
    });
    // if offeree is already prohibited
    if (await this.findOne({ where: { offeror, offeree } }))
      throw new ConflictException('The offeree has already been prohibited.');
    try {
      // if insert query failed to execute
      await this.insert(prohibition);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO prohibitions VALUES(${offeror.idOfferors}, ${offeree.idOfferees}, ${beginning}, ${conclusion}, ${cause})`,
        [offeror.idOfferors, offeree.idOfferees],
        error.message,
      );
    }
  }

  async selectProhibitions(idOfferors: string): Promise<Prohibition[]> {
    const query = this.createQueryBuilder('prohibitions');
    query.where({ offeror: { idOfferors } });
    try {
      // if select query failed to execute
      return await query.getMany();
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM prohibitions WHERE idOfferors = ${idOfferors}`,
        [idOfferors],
        error.message,
      );
    }
  }

  async selectProhibition(idProhibitions: string): Promise<Prohibition> {
    const query = this.createQueryBuilder('prohibitions');
    query.where({ idProhibitions });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM prohibitions WHERE idProhibitions = ${idProhibitions}`,
        [idProhibitions],
        error.message,
      );
    }
  }

  async updateProhibition(
    idProhibitions: string,
    updateProhibitonTimeframeDTO: UpdateProhibitionTimeframeDTO,
  ): Promise<void> {
    const { beginning, conclusion } = updateProhibitonTimeframeDTO;
    const prohibition = await this.findOne({ idProhibitions });
    prohibition.beginning = new Date(beginning);
    prohibition.conclusion = new Date(conclusion);
    try {
      // if update query failed to execute
      await this.save(prohibition);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE prohibitions SET beginning = ${beginning}, conclusion = ${conclusion} WHERE idProhibitions = ${idProhibitions}`,
        [idProhibitions, beginning, conclusion],
        error.message,
      );
    }
  }

  async deleteProhibition(idProhibitions: string): Promise<void> {
    try {
      // if delete query failed to execute
      await this.delete({ idProhibitions });
    } catch (error) {
      throw new QueryFailedError(
        `DELETE FROM prohibitions WHERE idProhibitions = ${idProhibitions}`,
        [idProhibitions],
        error.message,
      );
    }
  }
}
