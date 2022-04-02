import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
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

  reserve(makeReservationDTO: MakeReservationDTO): Promise<void> {
    return this.reservationsRepository.insertReservation(makeReservationDTO);
  }

  async getReservations(
    account: Account,
    getReservationFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    const { todaysDate } = getReservationFilterDTO;
    const getRequestsFilterDTO = new GetRequestsFilterDTO();
    getRequestsFilterDTO.todaysDate = todaysDate;
    const requests = await this.requestService.getRequests(
      account,
      getReservationFilterDTO,
    );
    return this.reservationsRepository.selectReservations(
      getReservationFilterDTO,
      requests,
    );
  }

  getReservation(account: Account, idRequests: string): Promise<Reservation> {
    return this.reservationsRepository.selectReservation(account, idRequests);
  }

  async deleteReservation(account: Account, idRequests: string): Promise<void> {
    const reservation = await this.reservationsRepository.findOne({
      idReservations: idRequests,
    });
    // if reservation was not found
    if (!reservation) throw new NotFoundException('Reservation was not found.');
    // if reservation wasn't confirmed by the account
    if (reservation.request.offeror.account !== account)
      throw new UnauthorizedException(
        "You're not the confirmator of the reservation.",
      );
    return this.reservationsRepository.deleteReservation(idRequests);
  }
}
