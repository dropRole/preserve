import { EntityRepository, Repository } from 'typeorm';
import { Account } from './account.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { ErrorCode } from './enum/error-code.enum';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async insertAccount(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentialsDTO;
    // generate bcrypt hash substrated from password and salt
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const account = this.create({ username, password: hash });
    try {
      await this.insert(account);
    } catch (error) {
      // if offeree username is duplicate
      if (error.code === ErrorCode.UniqueViolation)
        throw new ConflictException('Username already exists.');
    }
  }
}
