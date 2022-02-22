import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsRepository } from './requests.repository';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { ReservationsService } from 'src/reservations/reservations.service';

@Injectable()
export class RequestsService {
  constructor(
    private reservationsService: ReservationsService,
    @InjectRepository(RequestsRepository)
    private requestRepository: RequestsRepository,
  ) {}

  requestForReservation(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestRepository.insertRequest(requestForReservationDTO);
  }

  getRequests(getRequestsFilterDTO: GetRequestsFilterDTO): Promise<Request[]> {
    return this.requestRepository.selectRequests(getRequestsFilterDTO);
  }

  getRequest(idRequests: string): Promise<Request> {
    return this.requestRepository.selectRequest(idRequests);
  }

  retreatRequest(idRequests: string): Promise<void> {
    // if request hasn't been confirmed as reservation
    if (this.reservationsService.getReservation(idRequests))
      throw new ConflictException('Request is already confirmed.');
    return this.requestRepository.deleteRequest(idRequests);
  }
}
