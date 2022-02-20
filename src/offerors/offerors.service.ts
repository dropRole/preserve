import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  getOfferorById(idOfferors: string): Promise<Offeror> {
    return this.offerorsRepository.selectOfferorById(idOfferors);
  }
  getOfferorByUsername(username: string): Promise<Offeror> {
    return this.offerorsRepository.selectOfferorByUsername(username);
  }
  updateOfferorUsername(
    idOfferors: string,
    updateOfferorUsernameDTO: UpdateOfferorUsernameDTO,
  ): Promise<void> {
    const { username } = updateOfferorUsernameDTO;
    // if handed username already exists
    if (
      this.offerorsRepository.selectOfferorByUsername(username) instanceof
      Offeror
    )
      throw new ConflictException('Username already exists.');
    return this.offerorsRepository.updateOfferorUsername(
      idOfferors,
      updateOfferorUsernameDTO,
    );
  }
  updateOfferorEmail(
    idOfferors: string,
    updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    return this.offerorsRepository.updateOfferorEmail(
      idOfferors,
      updateOfferorEmailDTO,
    );
  }
  updateOfferorBusinessInfo(
    idOfferors: string,
    updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    return this.offerorsRepository.updateOfferorBusinessInfo(
      idOfferors,
      updateOfferorBusinessInfoDTO,
    );
  }
}
