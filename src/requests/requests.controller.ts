import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { RequestsService } from './requests.service';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';
import { Privileges } from 'src/auth/privilege.decorator';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Account } from 'src/auth/account.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('requests')
@UseGuards(AuthGuard())
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post()
  @Privileges(Privilege.Offeree)
  requestForReservation(
    @GetAccount() account: Account,
    @Body() requestForReservationDTO: RequestForReservationDTO,
  ): Promise<Request> {
    return this.requestsService.requestForReservation(
      account,
      requestForReservationDTO,
    );
  }

  @Get()
  @Privileges(Privilege.Offeror)
  getRequests(
    @GetAccount() account: Account,
    @Query() getRequestsFilterDTO: GetRequestsFilterDTO,
  ): Promise<Request[]> {
    return this.requestsService.getRequests(account, getRequestsFilterDTO);
  }

  @Get('/:idRequests')
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  getRequestById(
    @GetAccount() account: Account,
    @Param('idRequests') idRequests: string,
  ): Promise<Request> {
    return this.requestsService.getRequestById(account, idRequests);
  }

  @Delete('/:idRequests')
  @Privileges(Privilege.Offeree)
  retreatRequest(
    @GetAccount() account: Account,
    @Param('idRequests') idRequest: string,
  ): Promise<void> {
    return this.requestsService.retreatRequest(account, idRequest);
  }
}
