import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('reservation')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
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
  getReservation(
    @Param('idRequests') idRequests: string,
  ): Promise<Reservation> {
    return this.reservationsService.getReservation(idRequests);
  }

  @Delete()
  deleteReservation(@Param('idRequests') idRequests: string): Promise<void> {
    return this.reservationsService.deleteReservation(idRequests);
  }
}
