import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { RequestsService } from '../requests/requests.service';
import { GetRequestsFilterDTO } from 'src/requests/dto/get-requests-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(forwardRef(() => RequestsService))
    private requestService: RequestsService,
    @InjectRepository(ReservationsRepository)
    private reservationsRepository: ReservationsRepository,
  ) {}

  async reserve(
    account: Account,
    makeReservationDTO: MakeReservationDTO,
  ): Promise<void> {
    const { idRequests } = makeReservationDTO;
    const request = await this.requestService.getRequestById(
      account,
      idRequests,
    );
    return this.reservationsRepository.insertReservation(request);
  }

  async getReservations(
    account: Account,
    getReservationFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    const { todaysDate } = getReservationFilterDTO;
    const getRequestsFilterDTO = new GetRequestsFilterDTO();
    getRequestsFilterDTO.todaysDate = todaysDate;
    return this.reservationsRepository.selectReservations(
      account,
      getReservationFilterDTO,
    );
  }

  getReservation(account: Account, idRequests: string): Promise<Reservation> {
    return this.reservationsRepository.selectReservation(account, idRequests);
  }

  async deleteReservation(account: Account, idRequests: string): Promise<void> {
    const reservation = await this.getReservation(account, idRequests);
    // if reservation wasn't confirmed by the account
    if (reservation.request.offeror.account.username !== account.username)
      throw new UnauthorizedException(
        "You're not the confirmator of the reservation.",
      );
    return this.reservationsRepository.deleteReservation(idRequests);
  }
}
