import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OffereesService } from 'src/offerees/offerees.service';
import { AccountsRepository } from './accounts.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferorsService } from 'src/offerors/offerors.service';
import { RecordOfferorDTO } from 'src/offerors/dto/record-offeror.dto';
import { Privilege } from './enum/privilege.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
    private offereesService: OffereesService,
    private offerorsService: OfferorsService,
    private jwtService: JwtService,
  ) {}

  offereeSignUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    try {
      // if username unique violation appeared
      this.accountsRepository.insertAccount(authCredentialsDTO);
    } catch (error) {}
    return this.offereesService.recordAnOfferee(authCredentialsDTO);
  }

  offerorSignUp(
    authCredentialsDTO: AuthCredentialsDTO,
    recordOfferorDTO: RecordOfferorDTO,
  ): Promise<void> {
    try {
      // if username unique violation appeared
      this.accountsRepository.insertAccount(authCredentialsDTO);
    } catch (error) {}
    const { username } = authCredentialsDTO;
    return this.offerorsService.recordAnOfferor(recordOfferorDTO, username);
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;
    const account = await this.accountsRepository.findOne({
      username,
    });
    let accessToken: string, payload: JWTPayload;
    // if account with the given credentails is registered
    if (account && (await bcrypt.compare(password, account.password))) {
      // check if offerees account credentials
      if (this.offereesService.getOffereeByUsername(username)) {
        payload = { username };
        accessToken = await this.jwtService.sign(payload);
      }

      // check if offerors account credentials
      if (this.offerorsService.getOfferorByUsername(username)) {
        payload = { username };
        accessToken = await this.jwtService.sign(payload);
      }
      return { accessToken };
    } else throw new UnauthorizedException('Check your login credentials.');
  }
}
