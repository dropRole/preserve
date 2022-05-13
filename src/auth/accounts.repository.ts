import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { Account } from './account.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { ErrorCode } from './enum/error-code.enum';
import { ConflictException } from '@nestjs/common';
import { Privilege } from './enum/privilege.enum';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async insertAccount(
    authCredentialsDTO: AuthCredentialsDTO,
    privilege: Privilege,
  ): Promise<Account> {
    const { username, password } = authCredentialsDTO;
    // generate bcrypt hash substrated from password and salt
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const account = this.create({ username, password: hash, privilege });
    try {
      await this.insert(account);
    } catch (error) {
      // if offeree username is duplicate
      if (error.code === ErrorCode.UniqueViolation)
        throw new ConflictException('Username already exists.');
    }
    return account;
  }

  async updateAccountUsername(
    account: Account,
    username: string,
  ): Promise<void> {
    account.username = username;
    try {
      await this.save(account);
    } catch (error) {
      throw new QueryFailedError(
        'UPDATE accounts SER username = :newUsername WHERE username = :lastUsername ',
        [username, account.username],
        error.message,
      );
    }
  }
}
