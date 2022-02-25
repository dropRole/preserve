import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private requestsRepository: RequestsRepository,
  ) {}

  requestForReservation(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestsRepository.insertRequest(requestForReservationDTO);
  }

  getRequests(getRequestsFilterDTO: GetRequestsFilterDTO): Promise<Request[]> {
    return this.requestsRepository.selectRequests(getRequestsFilterDTO);
  }

  getRequest(idRequests: string): Promise<Request> {
    return this.requestsRepository.selectRequest(idRequests);
  }

  async retreatRequest(idRequests: string): Promise<void> {
    // if requests was not found
    if (!(await this.requestsRepository.findOne(idRequests)))
      throw new NotFoundException('Request was not found.');
    if (this.reservationsService.getReservation(idRequests))
      // if request hasn't been confirmed as reservation
      throw new ConflictException('Request is already confirmed.');
    return this.requestsRepository.deleteRequest(idRequests);
  }
}
