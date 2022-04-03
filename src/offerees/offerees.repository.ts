import { Account } from 'src/auth/account.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';

@EntityRepository(Offeree)
export class OffereesRepository extends Repository<Offeree> {
  async insertOfferee(account: Account): Promise<void> {
    const offeree = this.create({ account });
    await this.insert(offeree);
  }
  async selectOfferee(idOfferees: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ idOfferees });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [idOfferees], error.message);
    }
  }
  async selectOffereeByUsername(username: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ username });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [username], error.message);
    }
  }
  async updateOffereeUsername(
    account: Account,
    updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    const { username } = updateOffereeUsernameDTO;
    const offeree = await this.findOne({ account });
    account.username = username;
    offeree.account = account;
    try {
      // if update query failed to execute
      await this.save(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerees SET username = ${username} WHERE id_offerees = ${offeree.idOfferees}`,
        [username],
        error.message,
      );
    }
  }
  async updateOffereeEmail(
    account: Account,
    updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    const { email } = updateOffereeEmailDTO;
    const offeree = await this.findOne({ account });
    offeree.email = email;
    try {
      // if update query failed to execute
      await this.save(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `UPDATE offerees SET email = ${email} WHERE id_offerees = ${offeree.idOfferees}`,
        [offeree.idOfferees, email],
        error.message,
      );
    }
  }
}
