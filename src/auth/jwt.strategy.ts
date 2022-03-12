import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Connection } from 'typeorm';
import { Account } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private accountsRepository: AccountsRepository;
  constructor(private connection: Connection) {
    super({
      secretOrKey: 'preserveapp',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.accountsRepository =
      this.connection.getCustomRepository(AccountsRepository);
  }

  async validate(payload: JWTPayload) {
    const { username } = payload;
    const account: Account = await this.accountsRepository.findOne({
      username,
    });
    // if account doesn't exist
    if (!account) throw new UnauthorizedException('Account does not exist');
    return account;
  }
}
