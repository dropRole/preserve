import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from './account.entity';
import { AccountsRepository } from './accounts.repository';
import { adminCredentials } from './constants';
import { Privilege } from './enum/privilege.enum';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
  ) {
    super({
      secretOrKey:
        ';BY/[2n`@h!Yfr;HK4ezTa/.)h5A]R!r4g"t<z9xFETbbxXp9Fm>*}!&y^!8$ay%',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWTPayload) {
    const { username } = payload;
    // if admins account
    if (adminCredentials.username === adminCredentials.username) {
      const account = new Account();
      account.username = adminCredentials.username;
      account.password = adminCredentials.password;
      account.privilege = Privilege.Admin;
      return account;
    }
    const account: Account = await this.accountsRepository.findOne({
      username,
    });
    // if account doesn't exist
    if (!account) throw new UnauthorizedException('Account does not exist');
    return account;
  }
}
