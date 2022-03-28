import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsRepository } from './requests.repository';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Account } from 'src/auth/account.entity';

@Injectable()
export class RequestsService {
  constructor(
    private reservationsService: ReservationsService,
    @InjectRepository(RequestsRepository)
    private requestsRepository: RequestsRepository,
  ) {}

  requestForReservation(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestsRepository.insertRequest(requestForReservationDTO);
  }

  getRequests(
    account: Account,
    getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    return this.requestsRepository.selectRequests(
      account,
      getRequestsFilterDTO,
    );
  }

  async getRequestById(account: Account, idRequests: string): Promise<Request> {
    return this.requestsRepository.selectRequest(account, idRequests);
  }

  async retreatRequest(account: Account, idRequests: string): Promise<void> {
    const request = await this.requestsRepository.findOne({ idRequests });
    // if request was not found
    if (!(await this.requestsRepository.findOne(idRequests)))
      throw new NotFoundException('Request was not found.');
    // if request hasn't been confirmed as reservation
    if (this.reservationsService.getReservation(idRequests))
      throw new ConflictException('Request is already confirmed.');
    // if request is owned by an account
    if (request.offeree.account == account)
      return this.requestsRepository.deleteRequest(idRequests);
  }
}
