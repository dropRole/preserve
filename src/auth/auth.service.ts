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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
    private offereesService: OffereesService,
    private offerorsService: OfferorsService,
    private jwtService: JwtService,
  ) {}

  async offereeSignUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    try {
      // if username unique violation appeared
      this.accountsRepository.insertAccount(authCredentialsDTO);
    } catch (error) {}
    this.offereesService.recordAnOfferee(authCredentialsDTO);
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

  async offereeSignIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;
    const account = await this.accountsRepository.findOne({
      username,
    });
    // if account with the given credentails is registered
    if (account && (await bcrypt.compare(password, account.password))) {
      const payload: JWTPayload = { username, role: 'offeree' };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else throw new UnauthorizedException('Check your login credentials.');
  }
}
