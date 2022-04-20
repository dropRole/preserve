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
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Privileges } from 'src/auth/privilege.decorator';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(AuthGuard())
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  @Privileges(Privilege.Offeror)
  reserve(
    @GetAccount() account: Account,
    @Body() makeReservationDTO: MakeReservationDTO,
  ): Promise<void> {
    return this.reservationsService.reserve(account, makeReservationDTO);
  }

  @Get()
  @Privileges(Privilege.Offeror)
  getReservations(
    @GetAccount() account: Account,
    @Query() getReservationsFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    return this.reservationsService.getReservations(
      account,
      getReservationsFilterDTO,
    );
  }

  @Get('/:idReservations')
  @Privileges(Privilege.Admin, Privilege.Offeror, Privilege.Offeree)
  getReservation(
    @GetAccount() account: Account,
    @Param('idReservations') idReservations: string,
  ): Promise<Reservation> {
    return this.reservationsService.getReservation(account, idReservations);
  }

  @Delete('/:idRequests')
  @Privileges(Privilege.Offeror)
  deleteReservation(
    @GetAccount() account: Account,
    @Param('idRequests') idRequests: string,
  ): Promise<void> {
    return this.reservationsService.deleteReservation(account, idRequests);
  }
}
