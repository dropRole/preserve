import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProhibitOffereeDTO } from './dto/prohibit-offeree.dto';
import { UpdateProhibitionTimeframeDTO } from './dto/update-prohibition-timeframe.dto';
import { Prohibition } from './prohibitions.entity';
import { ProhibitionsRepository } from './prohibitons.repository';

@Injectable()
export class ProhibitionsService {
  constructor(
    @InjectRepository(ProhibitionsRepository)
    private prohibitionsRepository: ProhibitionsRepository,
  ) {}

  prohibitAnOfferee(prohibitOffereeDTO: ProhibitOffereeDTO): Promise<void> {
    return this.prohibitionsRepository.insertProhibition(prohibitOffereeDTO);
  }

  getProhibitions(idOfferors: string): Promise<Prohibition[]> {
    return this.prohibitionsRepository.selectProhibitions(idOfferors);
  }

  getProhibition(idProhibitions: string): Promise<Prohibition> {
    return this.prohibitionsRepository.selectProhibition(idProhibitions);
  }

  updateProhibitionTimeframe(
    idProhibitions: string,
    updateProhibitonTimeframeDTO: UpdateProhibitionTimeframeDTO,
  ): Promise<void> {
    return this.prohibitionsRepository.updateProhibition(
      idProhibitions,
      updateProhibitonTimeframeDTO,
    );
  }

  deleteProhibition(idProhibitions: string): Promise<void> {
    return this.prohibitionsRepository.deleteProhibition(idProhibitions);
  }
}
