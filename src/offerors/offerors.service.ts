import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/account.entity';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { UpdateOfferorUsernameDTO } from './dto/update-offeror-username.dto';
import { Offeror } from './offeror.entity';
import { OfferorsRepository } from './offerors.repository';

@Injectable()
export class OfferorsService {
  constructor(
    @InjectRepository(OfferorsRepository)
    private offerorsRepository: OfferorsRepository,
  ) {}

  recordAnOfferor(
    name: string,
    address: string,
    email: string,
    telephone: string,
    businessHours: string,
    responsiveness: number,
    compliance: number,
    timeliness: number,
    account: Account,
  ): Promise<void> {
    return this.offerorsRepository.insertOfferor(
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

  getOfferorById(idOfferors: string): Promise<Offeror> {
    return this.offerorsRepository.selectOfferorById(idOfferors);
  }

  getOfferorByUsername(username: string): Promise<Offeror> {
    return this.offerorsRepository.selectOfferorByUsername(username);
  }
  
  async updateOfferorEmail(
    account: Account,
    updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    // if offeror was not found
    if (!(await this.offerorsRepository.findOne({ account })))
      throw new NotFoundException('Offeror was not found.');
    return this.offerorsRepository.updateOfferorEmail(
      account,
      updateOfferorEmailDTO,
    );
  }

  async updateOfferorBusinessInfo(
    account: Account,
    updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    // if offeror was not found
    if (!(await this.offerorsRepository.findOne({ account })))
      throw new NotFoundException('Offeror was not found.');
    return this.offerorsRepository.updateOfferorBusinessInfo(
      account,
      updateOfferorBusinessInfoDTO,
    );
  }
}
