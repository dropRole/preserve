import { isRFC3339 } from 'class-validator';
import { OffereeAuthCredentialsDTO } from 'src/auth/dto/offeree-auth-credentials.dto';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';

@EntityRepository(Offeree)
export class OffereesRepository extends Repository<Offeree> {
  async insertOfferee(
    offereeAuthCredentialsDTO: OffereeAuthCredentialsDTO,
  ): Promise<Offeree> {
    const { username, email } = offereeAuthCredentialsDTO;
    const offeree = this.create({ username, email });
    await this.save(offeree);
    return offeree;
  }
  async selectOfferee(idOfferees: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ idOfferees });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [idOfferees], 'postgres');
    }
  }
  async selectOffereeByUsername(username: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ username });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [username], 'postgres');
    }
  }
  async updateOffereeUsername(
    idOfferees: string,
    updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    const { username } = updateOffereeUsernameDTO;
    const offeree = await this.findOne({ idOfferees });
    offeree.username = username;
    try {
      // if update query failed to execute
      await this.save(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerees SET username = ${username} WHERE id_offerees = ${offeree.idOfferees}`,
        [username],
        'postgres',
      );
    }
  }
  async updateOffereeEmail(
    idOfferees: string,
    updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    const { email } = updateOffereeEmailDTO;
    const offeree = await this.findOne({ idOfferees });
    offeree.email = email;
    try {
      // if update query failed to execute
      await this.save(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerees SET email = ${email} WHERE id_offerees = ${offeree.idOfferees}`,
        [idOfferees, email],
        'postgres',
      );
    }
  }
}
