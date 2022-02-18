import { OffereeAuthCredentialsDTO } from 'src/auth/dto/offeree-auth-credentials.dto';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';
import * as bcrypt from 'bcrypt';

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
  async selectOfferee(id_offerees: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ id_offerees });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [id_offerees], 'postgres');
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
    updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    const { username } = updateOffereeUsernameDTO;
    const offeree = await this.findOne({ username });
    offeree.username = username;
    try {
      // if update query failed to execute
      await this.save(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerees SET username = ${username} WHERE id_offerees = ${offeree.id_offerees}`,
        [username],
        'postgres',
      );
    }
  }
  async updateOffereeEmail(
    id_offerees: string,
    updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    const { email } = updateOffereeEmailDTO;
    const offeree = await this.findOne({ id_offerees });
    offeree.email = email;
    try {
      // if update query failed to execute
      await this.save(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerees SET email = ${email} WHERE id_offerees = ${offeree.id_offerees}`,
        [id_offerees, email],
        'postgres',
      );
    }
  }
}
