import { Account } from '../auth/account.entity';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { Offeree } from './offeree.entity';

@EntityRepository(Offeree)
export class OffereesRepository extends Repository<Offeree> {
  
  async insertOfferee(account: Account): Promise<void> {
    const offeree = this.create({ account });
    try {
      // query might fail on execution
      await this.insert(offeree);
    } catch (error) {
      throw new QueryFailedError(
        `INSERT INTO offerees VALUES(${
          (offeree.email, offeree.account.username)
        })`,
        [offeree.email, offeree.account.username],
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
