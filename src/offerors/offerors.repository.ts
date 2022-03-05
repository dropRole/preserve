import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { RecordOfferorDTO } from './dto/record-offeror.dto';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { UpdateOfferorUsernameDTO } from './dto/update-offeror-username.dto';
import { Offeror } from './offeror.entity';

@EntityRepository(Offeror)
export class OfferorsRepository extends Repository<Offeror> {
  async insertOfferor(
    recordOfferorDTO: RecordOfferorDTO,
    username: string,
  ): Promise<void> {
    const {
      name,
      address,
      email,
      telephone,
      businessHours,
      responsiveness,
      compliance,
      timeliness,
    } = recordOfferorDTO;
    const offeror = this.create({
      name,
      address,
      email,
      telephone,
      businessHours,
      responsiveness,
      compliance,
      timeliness,
      username,
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
      return await this.findOne({ username });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM offerors WHERE username = ${username}`,
        [username],
        error.message,
      );
    }
  }

  async updateOfferorUsername(
    idOfferors: string,
    updateOfferorUsernameDTO: UpdateOfferorUsernameDTO,
  ): Promise<void> {
    const { username } = updateOfferorUsernameDTO;
    const offeror = await this.findOne({ idOfferors });
    offeror.username = username;
    try {
      // if select query failed to execute
      await this.save(offeror);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerors SET username = ${username} WHERE idOfferors = ${idOfferors}`,
        [idOfferors, username],
        error.message,
      );
    }
  }
  async updateOfferorEmail(
    idOfferors: string,
    updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    const { email } = updateOfferorEmailDTO;
    const offeror = await this.findOne({ idOfferors });
    offeror.email = email;
    try {
      // if select query failed to execute
      await this.save(offeror);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerors SET email = ${email} WHERE idOfferors = ${idOfferors}`,
        [idOfferors, email],
        error.message,
      );
    }
  }
  async updateOfferorBusinessInfo(
    idOfferors: string,
    updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    const { address, telephone, businessHours } = updateOfferorBusinessInfoDTO;
    const offeror = await this.findOne({ idOfferors });
    offeror.address = address;
    offeror.telephone = telephone;
    offeror.businessHours = businessHours;
    try {
      // if select query failed to execute
      await this.save(offeror);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerors SET address = ${address}, telephone = ${telephone}, businessHours = ${businessHours}  WHERE idOfferors = ${idOfferors}`,
        [address, telephone, businessHours],
        error.message,
      );
    }
  }
}
