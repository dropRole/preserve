import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from '../auth/account.entity';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { RequestsService } from '../requests/requests.service';
import { GetRequestsFilterDTO } from '../requests/dto/get-requests-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Privilege } from '../auth/enum/privilege.enum';

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

  async getReservationById(
    account: Account,
    idRequests: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationsRepository.selectReservation(
      account,
      idRequests,
    );
    // if the given request wasn't the subject of reservation
    if (!reservation)
      throw new NotFoundException(
        `The given request ${idRequests} wasn't the subject of any reservation. `,
      );
    // if reservation wasn't made nor received by the given account nor admin owns the account
    if (
      account.privilege !== Privilege.Admin &&
      reservation.request.offeree.account.username !== account.username &&
      reservation.request.offeror.account.username !== account.username
    )
      throw new UnauthorizedException(
        'Reservation is not related with your account.',
      );
    return reservation;
  }

  async deleteReservation(account: Account, idRequests: string): Promise<void> {
    const reservation = await this.getReservationById(account, idRequests);
    // if reservation wasn't confirmed by the account
    if (reservation.request.offeror.account.username !== account.username)
      throw new UnauthorizedException(
        "You're not the confirmator of the reservation.",
      );
    return this.reservationsRepository.deleteReservation(idRequests);
  }
}
