import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { OffereeAuthCredentialsDTO } from './dto/offeree-auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async insertOffereeAccount(
    offereeAuthCredentialsDTO: OffereeAuthCredentialsDTO,
  ): Promise<boolean> {
    const { username, password } = offereeAuthCredentialsDTO;
    // generate bcrypt hash substrated from password and salt
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const account = this.create({ username, password: hash });
    try {
      await this.insert(account);
    } catch (error) {
      // if offeree username is duplicate
      return false;
    }
    return true;
  }
}
