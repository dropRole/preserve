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
import { Account } from 'src/auth/account.entity';
import { OfferorsService } from 'src/offerors/offerors.service';
import { OffereesService } from 'src/offerees/offerees.service';
import { ReservationsRepository } from 'src/reservations/reservations.repository';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestsRepository)
    private requestsRepository: RequestsRepository,
    @InjectRepository(ReservationsRepository)
    private reservationsRepository: ReservationsRepository,
    private offerorsService: OfferorsService,
    private offereesService: OffereesService,
  ) {}

  async requestForReservation(
    account: Account,
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    const { idOfferors, requestedAt, requestedFor, seats, cause, note } =
      requestForReservationDTO;
    const offeror = await this.offerorsService.getOfferorById(idOfferors);
    const offeree = await this.offereesService.getOffereeByUsername(
      account.username,
    );
    return this.requestsRepository.insertRequest(
      offeror,
      offeree,
      requestedAt,
      requestedFor,
      seats,
      cause,
      note,
    );
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

  getRequestById(account: Account, idRequests: string): Promise<Request> {
    const request = this.requestsRepository.selectRequest(account, idRequests);
    // if the subject request wasn't submitted
    if (!request)
      throw new NotFoundException(
        `The subject request ${idRequests} wasn't found.`,
      );
    return request;
  }

  async retreatRequest(account: Account, idRequests: string): Promise<void> {
    const request = await this.getRequestById(account, idRequests);
    // if request was confirmed as the reservation
    if (await this.reservationsRepository.findOne({ request: { idRequests } }))
      throw new ConflictException(
        `Request ${idRequests} was confirmed as a reservation.`,
      );
    if (request.offeree.account.username !== account.username)
      // if not the account of an author
      throw new UnauthorizedException("You're not authorized for the request.");
    return this.requestsRepository.deleteRequest(idRequests);
  }
}
