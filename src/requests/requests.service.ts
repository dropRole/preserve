import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsRepository } from './requests.repository';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Account } from 'src/auth/account.entity';
import { OfferorsService } from 'src/offerors/offerors.service';
import { OffereesService } from 'src/offerees/offerees.service';
import { Reservation } from 'src/reservations/reservation.entity';

@Injectable()
export class RequestsService {
  constructor(
    @Inject(forwardRef(() => ReservationsService))
    private reservationsService: ReservationsService,
    @InjectRepository(RequestsRepository)
    private requestsRepository: RequestsRepository,
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
    return this.requestsRepository.selectRequest(account, idRequests);
  }

  async retreatRequest(account: Account, idRequests: string): Promise<void> {
    const request = await this.getRequestById(account, idRequests);
    // if request hasn't been confirmed and is owned by an account
    if (
      (await this.reservationsService.getReservation(account, idRequests)) ===
        undefined &&
      request.offeree.account.username === account.username
    )
      return this.requestsRepository.deleteRequest(idRequests);
  }
}
