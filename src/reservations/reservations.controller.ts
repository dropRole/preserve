import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { Roles } from 'src/auth/privilege.decorator';
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

  /*  @Get()
  getReservations(
    @Query() getReservationsFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    return this.reservationsService.getReservations(getReservationsFilterDTO);
  } */

  @Get('/:idRequests')
  @Roles(Privilege.Admin, Privilege.Offeror, Privilege.Offeree)
  getReservation(
    @Param('idRequests') idRequests: string,
  ): Promise<Reservation> {
    return this.reservationsService.getReservation(idRequests);
  }

  @Delete()
  @Roles(Privilege.Offeror)
  deleteReservation(@Param('idRequests') idRequests: string): Promise<void> {
    return this.reservationsService.deleteReservation(idRequests);
  }
}
