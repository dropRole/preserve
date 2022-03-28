import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsService } from './requests.service';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { Roles } from 'src/auth/privilege.decorator';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Account } from 'src/auth/account.entity';

@Controller('request')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post(':idRequests')
  @Roles(Privilege.Offeree)
  requestForReservation(
    requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestsService.requestForReservation(requestForReservationDTO);
  }

  @Get()
  @Roles(Privilege.Offeror)
  getRequests(
    @GetAccount() account: Account,
    @Query() getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    return this.requestsService.getRequests(account, getRequestsFilterDTO);
  }

  @Get('/:idRequests')
  @Roles(Privilege.Offeror, Privilege.Offeree)
  getRequestById(
    @GetAccount() account: Account,
    @Param() idRequests: string,
  ): Promise<Request> {
    return this.requestsService.getRequestById(account, idRequests);
  }

  @Delete()
  @Roles(Privilege.Offeree)
  retreatRequest(
    @GetAccount() account: Account,
    @Param('idRequests') idRequest: string,
  ): Promise<void> {
    return this.requestsService.retreatRequest(account, idRequest);
  }
}
