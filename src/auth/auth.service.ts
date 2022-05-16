import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OffereesService } from '../offerees/offerees.service';
import { AccountsRepository } from './accounts.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferorsService } from '../offerors/offerors.service';
import { Privilege } from './enum/privilege.enum';
import { OfferorSignUpDTO } from './dto/offeror-signup.dto';
import { adminCredentials } from './constants';
import { Account } from './account.entity';
import { UpdateUsernameDTO } from './dto/update-username.dto';

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
    const account = await this.accountsRepository.insertAccount(
      authCredentialsDTO,
      Privilege.Offeree,
    );
    return this.offereesService.recordAnOfferee(account);
  }

  async offerorSignUp(offerorSignUpDto: OfferorSignUpDTO): Promise<void> {
    const {
      username,
      password,
      name,
      address,
      email,
      telephone,
      businessHours,
      responsiveness,
      compliance,
      timeliness,
    } = offerorSignUpDto;
    const authCredentialsDTO = new AuthCredentialsDTO();
    authCredentialsDTO.username = username;
    authCredentialsDTO.password = password;
    const account = await this.accountsRepository.insertAccount(
      authCredentialsDTO,
      Privilege.Offeror,
    );
    return this.offerorsService.recordAnOfferor(
      name,
      address,
      email,
      telephone,
      businessHours,
      responsiveness,
      compliance,
      timeliness,
      account,
    );
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;
    let payload: JWTPayload, accessToken: string;
    // if admin account attempted a sign in
    if (
      username === adminCredentials.username &&
      (await bcrypt.compare(password, adminCredentials.password))
    ) {
      payload = { username: adminCredentials.username };
      accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }
    const account = await this.accountsRepository.findOne({
      username,
    });
    // if account with the given credentials is registered
    if (account && (await bcrypt.compare(password, account.password))) {
      payload = { username };
      accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else throw new UnauthorizedException('Check your login credentials.');
  }

  async updateAccountUsername(
    account: Account,
    updateAccountUsername: UpdateUsernameDTO,
  ): Promise<{ accessToken: string }> {
    const { username } = updateAccountUsername;
    // if account doesn't exist
    if (
      !(await this.accountsRepository.findOne({
        where: { username: account.username },
      }))
    )
      throw new NotFoundException(`Account with ${username} was not found.`);
    if (this.accountsRepository.updateAccountUsername(account, username)) {
      const payload: JWTPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
  }
}
