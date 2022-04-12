import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/account.entity';
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
  recordAnOfferee(account: Account): Promise<void> {
    return this.offereesRepository.insertOfferee(account);
  }
  getOfferee(idOfferees: string): Promise<Offeree> {
    return this.offereesRepository.selectOfferee(idOfferees);
  }
  getOffereeByUsername(username: string): Promise<Offeree> {
    return this.offereesRepository.selectOffereeByUsername(username);
  }
  async updateOffereeUsername(
    account: Account,
    updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    const { username } = updateOffereeUsernameDTO;
    // if offeree was not found
    if (!(await this.offereesRepository.findOne({ account })))
      throw new NotFoundException('Offeree was not found.');
    // if provided username doesn't already exist
    if (
      this.offereesRepository.selectOffereeByUsername(username) instanceof
      Offeree
    )
      throw new ConflictException('Username already exists.');
    return this.offereesRepository.updateOffereeUsername(
      account,
      updateOffereeUsernameDTO,
    );
  }
  async updateOffereeEmail(
    account: Account,
    updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    // if offeree was not found
    if (!(await this.offereesRepository.findOne({ account })))
      throw new NotFoundException('Offeree was not found.');
    return this.offereesRepository.updateOffereeEmail(
      account,
      updateOffereeEmailDTO,
    );
  }
}
