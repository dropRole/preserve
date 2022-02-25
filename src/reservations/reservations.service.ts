import { Injectable, NotFoundException } from '@nestjs/common';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private reservationsRepository: ReservationsRepository) {}

  reserve(makeReservationDTO: MakeReservationDTO): Promise<void> {
    return this.reservationsRepository.insertReservation(makeReservationDTO);
  }

  /* getReservations(
    getReservationFilterDTO: GetReservationsFilterDTO,
  ): Promise<Reservation[]> {
    return this.reservationsRepository.selectReservations(
      getReservationFilterDTO,
    );
  } */

  getReservation(idRequests: string): Promise<Reservation> {
    return this.reservationsRepository.selectReservation(idRequests);
  }

  async deleteReservation(idRequests: string): Promise<void> {
    // if reservation was not found
    if (!(await this.reservationsRepository.findOne(idRequests)))
      throw new NotFoundException('Reservation was not found.');
    return this.reservationsRepository.deleteReservation(idRequests);
  }
}
