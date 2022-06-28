import { Account } from '../auth/account.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { Offeror } from './offeror.entity';

@EntityRepository(Offeror)
export class OfferorsRepository extends Repository<Offeror> {
  async insertOfferor(
    name: string,
    address: string,
    email: string,
    telephone: string,
    businessHours: string,
    responsiveness: number,
    compliance: number,
    timeliness: number,
    account: Account,
  ): Promise<void> {
    const offeror = this.create({
      name,
      address,
      email,
      telephone,
      businessHours,
      responsiveness,
      compliance,
      timeliness,
      account,
    });
    try {
      // if insert query failed to execute
      await this.insert(offeror);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO offerors VALUES(${name}, ${address}, ${email}, ${telephone}, ${responsiveness}, ${compliance}, ${timeliness})`,
        [
          name,
          address,
          email,
          telephone,
          responsiveness,
          compliance,
          timeliness,
        ],
        error.message,
      );
    }
  }

  async selectOfferorsByMunicipality(municipality: string): Promise<Offeror[]> {
    const query = this.createQueryBuilder('offerors');
    query.where('UPPER(offerors.address) LIKE UPPER(:municipality)', {
      municipality: `%${municipality}%`,
    });
    try {
      return await query.getMany();
    } catch (error) {
      throw new QueryFailedError(
        query.getSql(),
        [`%${municipality}%`],
        error.message,
      );
    }
  }

  async selectOfferorById(idOfferors: string): Promise<Offeror> {
    try {
      // if select query failed to execute
      return await this.findOne({ idOfferors });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM offerors WHERE idOfferors = ${idOfferors}`,
        [idOfferors],
        error.message,
      );
    }
  }

  async selectOfferorByUsername(username: string): Promise<Offeror> {
    try {
      // if select query failed to execute
      return await this.findOne({ where: { account: { username } } });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM offerors WHERE username = ${username}`,
        [username],
        error.message,
      );
    }
  }

  async updateOfferorEmail(
    account: Account,
    updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    const { email } = updateOfferorEmailDTO;
    const offeror = await this.findOne({ account });
    offeror.email = email;
    try {
      // if select query failed to execute
      await this.save(offeror);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerors SET email = ${email} WHERE idOfferors = ${offeror.idOfferors}`,
        [offeror.idOfferors, email],
        error.message,
      );
    }
  }
  async updateOfferorBusinessInfo(
    account: Account,
    updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    const { address, telephone, businessHours } = updateOfferorBusinessInfoDTO;
    const offeror = await this.findOne({ account });
    offeror.address = address;
    offeror.telephone = telephone;
    offeror.businessHours = businessHours;
    try {
      // if select query failed to execute
      await this.save(offeror);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerors SET address = ${address}, telephone = ${telephone}, businessHours = ${businessHours}  WHERE idOfferors = ${offeror.idOfferors}`,
        [address, telephone, businessHours],
        error.message,
      );
    }
  }
}
