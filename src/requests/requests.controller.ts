import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsService } from './requests.service';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';

@Controller('request')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post(':idRequests')
  requestFoReservation(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestsService.requestForReservation(requestForReservationDTO);
  }

  @Get()
  getRequests(
    @Query() getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    return this.requestsService.getRequests(getRequestsFilterDTO);
  }

  @Get('/:idRequests')
  getRequestById(@Param() idRequests: string): Promise<Request> {
    return this.requestsService.getRequest(idRequests);
  }

  @Delete()
  retreatRequest(idRequest: string): Promise<void> {
    return this.requestsService.retreatRequest(idRequest);
  }
}
