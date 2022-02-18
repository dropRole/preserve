import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { UpdateOfferorUsernameDTO } from './dto/update-offeror-username.dto';
import { Offeror } from './offeror.entity';

@EntityRepository(Offeror)
export class OfferorsRepository extends Repository<Offeror> {
  async selectOfferorById(idOfferors: string): Promise<Offeror> {
    try {
      // if select query failed to execute
      return await this.findOne({ idOfferors });
    } catch (error) {
      throw new QueryFailedError(
        `SELECT * FROM offerors WHERE idOfferors = ${idOfferors}`,
        [idOfferors],
        'postgres',
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
        'postgres',
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
        'postgres',
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
        'postgres',
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
        'postgres',
      );
    }
  }
}
