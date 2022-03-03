import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async insertOffereeAccount(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<boolean> {
    const { username, password } = authCredentialsDTO;
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
