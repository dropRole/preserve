import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffereeAuthCredentialsDTO } from 'src/auth/dto/offeree-auth-credentials.dto';
import { Offeree } from './offeree.entity';
import { OffereesRepository } from './offerees.repository';

@Injectable()
export class OffereesService {
  constructor(
    @InjectRepository(OffereesRepository)
    private offereesRepository: OffereesRepository,
  ) {}
  offereeSignUp(
    offereeAuthCredentialsDTO: OffereeAuthCredentialsDTO,
  ): Promise<Offeree> {
    return this.offereesRepository.insertOfferee(offereeAuthCredentialsDTO);
  }
  getOfferee(id_offerees: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(id_offerees);
  }
  getOffereeByUsername(username: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(username);
  }
}
