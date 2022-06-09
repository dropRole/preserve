import { Test } from '@nestjs/testing';
import { RequestsService } from '../requests/requests.service';
import * as mocks from './mocks.constants';
import { Reservation } from './reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

describe('reservationsService', () => {
  let reservationsService: ReservationsService;
  // instantiate dummy reservations module before running test suite
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: RequestsService, useValue: mocks.requestsService },
        {
          provide: ReservationsRepository,
          useValue: mocks.reservationsRepository,
        },
      ],
    }).compile();
    reservationsService = module.get(ReservationsService);
  });

  describe('reserve', () => {
    // evoke reservationsService.reserve and expect an Reservation instance
    it('Insert reservation on the basis of the confirmed request.', () => {
      const result = reservationsService.reserve(
        mocks.account,
        mocks.makeReservationDTO,
      );
      expect(result).resolves.toBeInstanceOf(Reservation);
    });
  });

  describe('getReservations', () => {
    // evoke reservationsService.getReservations and expect an array of Reservation instances
    it('Select reservations made on the given day.', () => {
      const result = reservationsService.getReservations(
        mocks.account,
        mocks.getReservationFilterDTO,
      );
      expect(result).resolves.toBeInstanceOf(Array);
    });
  });
  
  describe('getReservationById', () => {
    // evoke reservationsService.getReservationById and expect an Reservation instance
    it('Select the corresponding reservation via its identifier.', () => {
      const result = reservationsService.getReservationById(
        mocks.account,
        '29c58e6d-cdbf-4f41-bdbb-5d796d93f86e',
      );
      expect(result).resolves.toBeInstanceOf(Reservation);
    });
  });
  
  describe('deleteReservation', () => {
    // evoke reservationsService.deleteReservation and don't expect an exception to be thrown
    it('Delete the corresponding reservation via its identifier.', () => {
      const result = reservationsService.deleteReservation(
        mocks.account,
        '29c58e6d-cdbf-4f41-bdbb-5d796d93f86e',
      );
      expect(result).resolves.not.toThrow();
    });
  });
});
