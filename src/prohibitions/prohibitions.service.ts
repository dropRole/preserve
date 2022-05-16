import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffereesService } from '../offerees/offerees.service';
import { OfferorsService } from '../offerors/offerors.service';
import { ProhibitOffereeDTO } from './dto/prohibit-offeree.dto';
import { UpdateProhibitionTimeframeDTO } from './dto/update-prohibition-timeframe.dto';
import { Prohibition } from './prohibitions.entity';
import { ProhibitionsRepository } from './prohibitons.repository';

@Injectable()
export class ProhibitionsService {
  constructor(
    @InjectRepository(ProhibitionsRepository)
    private prohibitionsRepository: ProhibitionsRepository,
    private offerorsService: OfferorsService,
    private offereesService: OffereesService,
  ) {}

  async prohibitAnOfferee(
    prohibitOffereeDTO: ProhibitOffereeDTO,
  ): Promise<void> {
    const { idOfferees, idOfferors, beginning, conclusion, cause } =
      prohibitOffereeDTO;
    const offeror = await this.offerorsService.getOfferorById(idOfferors);
    const offeree = await this.offereesService.getOffereeById(idOfferees);
    return this.prohibitionsRepository.insertProhibition(
      offeror,
      offeree,
      beginning,
      conclusion,
      cause,
    );
  }

  getProhibitions(idOfferors: string): Promise<Prohibition[]> {
    return this.prohibitionsRepository.selectProhibitions(idOfferors);
  }

  getProhibition(idProhibitions: string): Promise<Prohibition> {
    return this.prohibitionsRepository.selectProhibition(idProhibitions);
  }

  async updateProhibitionTimeframe(
    idProhibitions: string,
    updateProhibitonTimeframeDTO: UpdateProhibitionTimeframeDTO,
  ): Promise<void> {
    // if reservation prohibition was not found
    if (await this.getProhibition(idProhibitions))
      return this.prohibitionsRepository.updateProhibition(
        idProhibitions,
        updateProhibitonTimeframeDTO,
      );
    else
      throw new NotFoundException(
        `Subject prohibitions ${idProhibitions} was not found.`,
      );
  }

  async deleteProhibition(idProhibitions: string): Promise<void> {
    // if reservation prohibition was determined
    if (await this.getProhibition(idProhibitions))
      return this.prohibitionsRepository.deleteProhibition(idProhibitions);
    else
      throw new NotFoundException(
        `Reservation prohibition ${idProhibitions} was not found.`,
      );
  }
}
