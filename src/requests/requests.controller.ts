import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsService } from './requests.service';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('request')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post(':idRequests')
  @Roles(Role.Offeree)
  requestFoReservation(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestsService.requestForReservation(requestForReservationDTO);
  }

  @Get()
  @Roles(Role.Offeror)
  getRequests(
    @Query() getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    return this.requestsService.getRequests(getRequestsFilterDTO);
  }

  @Get('/:idRequests')
  @Roles(Role.Offeror, Role.Offeree)
  getRequestById(@Param() idRequests: string): Promise<Request> {
    return this.requestsService.getRequest(idRequests);
  }

  @Delete()
  @Roles(Role.Offeree)
  retreatRequest(@Param('idRequests') idRequest: string): Promise<void> {
    return this.requestsService.retreatRequest(idRequest);
  }
}
