import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Roles } from 'src/auth/privilege.decorator';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('reservation')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  @Roles(Privilege.Offeror)
  reserve(@Body() makeReservationDTO: MakeReservationDTO): Promise<void> {
    return this.reservationsService.reserve(makeReservationDTO);
  }

  @Get()
  @Roles(Privilege.Offeror)
  getReservations(
    @GetAccount() account: Account,
    @Query() getReservationsFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    return this.reservationsService.getReservations(
      account,
      getReservationsFilterDTO,
    );
  }

  @Get('/:idRequests')
  @Roles(Privilege.Admin, Privilege.Offeror, Privilege.Offeree)
  getReservation(
    @GetAccount() account: Account,
    @Param('idRequests') idRequests: string,
  ): Promise<Reservation> {
    return this.reservationsService.getReservation(account, idRequests);
  }

  @Delete()
  @Roles(Privilege.Offeror)
  deleteReservation(
    @GetAccount() account: Account,
    @Param('idRequests') idRequests: string,
  ): Promise<void> {
    return this.reservationsService.deleteReservation(account, idRequests);
  }
}
