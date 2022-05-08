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

  async getOffereeById(idOfferees: string): Promise<Offeree> {
    const offeree = await this.offereesRepository.findOne({ idOfferees });
    // if subject offeree doesn't exist
    if (!offeree)
      throw new NotFoundException(
        `The subject ${idOfferees} offeree doesn't exist.`,
      );
    // eradicate password and privilege properties from Account property
    delete offeree.account.password;
    delete offeree.account.privilege;
    return offeree;
  }
  async getOffereeByUsername(username: string): Promise<Offeree> {
    const offeree = await this.offereesRepository.findOne({
      where: { account: { username } },
    });
    // if subject offeree doesn't exist
    if (!offeree)
      throw new NotFoundException(
        `An offeree with ${username} username doesn't exist.`,
      );
    // eradicate password and privilege properties from Account property
    delete offeree.account.password;
    delete offeree.account.privilege;
    return offeree;
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
