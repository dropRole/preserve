import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
  ) {
    super({
      secretOrKey: 'preserveapp',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
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
