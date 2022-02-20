import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffereeAuthCredentialsDTO } from 'src/auth/dto/offeree-auth-credentials.dto';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
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
  getOfferee(idOfferees: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(idOfferees);
  }
  getOffereeByUsername(username: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(username);
  }
  updateOffereeUsername(
    idOfferees: string,
    updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    const { username } = updateOffereeUsernameDTO;
    // if provided username doesn't already exist
    if (
      this.offereesRepository.selectOffereeByUsername(username) instanceof
      Offeree
    )
      throw new ConflictException('Username already exists.');
    return this.offereesRepository.updateOffereeUsername(
      idOfferees,
      updateOffereeUsernameDTO,
    );
  }
  updateOffereeEmail(
    idOfferees: string,
    updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    return this.offereesRepository.updateOffereeEmail(
      idOfferees,
      updateOffereeEmailDTO,
    );
  }
}
