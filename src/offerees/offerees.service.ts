import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from 'src/auth/dto/auth-credentials.dto';
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
  offereeSignUp(authCredentialsDTO: AuthCredentialsDTO): Promise<Offeree> {
    return this.offereesRepository.insertOfferee(authCredentialsDTO);
  }
  getOfferee(idOfferees: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(idOfferees);
  }
  getOffereeByUsername(username: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(username);
  }
  async updateOffereeUsername(
    idOfferees: string,
    updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    const { username } = updateOffereeUsernameDTO;
    // if offeree was not found
    if (!(await this.offereesRepository.findOne(idOfferees)))
      throw new NotFoundException('Offeree was not found.');
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
  async updateOffereeEmail(
    idOfferees: string,
    updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    // if offeree was not found
    if (!(await this.offereesRepository.findOne(idOfferees)))
      throw new NotFoundException('Offeree was not found.');
    return this.offereesRepository.updateOffereeEmail(
      idOfferees,
      updateOffereeEmailDTO,
    );
  }
}
