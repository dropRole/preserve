import { Test } from '@nestjs/testing';
import { Request } from './request.entity';
import { RequestsRepository } from './requests.repository';
import { RequestsService } from './requests.service';
import * as mocks from './mocks.constants';
import { OfferorsService } from '../offerors/offerors.service';
import { OffereesService } from '../offerees/offerees.service';
import { ReservationsRepository } from '../reservations/reservations.repository';

describe('requestsService', () => {
  // instantiate the dummy requests module before running tests
  let requestsService: RequestsService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestsService,
        { provide: OfferorsService, useValue: mocks.offerorsService },
        { provide: OffereesService, useValue: mocks.offereesService },
        { provide: RequestsRepository, useValue: mocks.requestsRepository },
        {
          provide: ReservationsRepository,
          useValue: mocks.reservationsRepository,
        },
      ],
    }).compile();
    requestsService = module.get(RequestsService);
  });

  describe('requestForReservation', () => {
    // evoke requestsService.requestForReservation and expect a Request instance
    it('Insert a request for reservation into the requests repository.', () => {
      const result = requestsService.requestForReservation(
        mocks.offereeAccount,
        mocks.requestForReservationDTO,
      );
      expect(result).resolves.toBeInstanceOf(Request);
    });
  });

  describe('getRequests', () => {
    // evoke requestsService.getRequests and expect an array of Request instances
    it('Select requests on the current day submitted by/ to the given account.', () => {
      const result = requestsService.getRequests(
        mocks.offereeAccount,
        mocks.getRequestsFilterDTO,
      );
      expect(result).resolves.toBeInstanceOf(Array);
    });
  });

  describe('getRequestById', () => {
    // evoke requestsService.getRequestById and expect Request instance
    it('Select the corresponding request via its identifier.', () => {
      const result = requestsService.getRequestById(
        mocks.offereeAccount,
        '29c58e6d-cdbf-4f41-bdbb-5d796d93f86e',
      );
      expect(result).resolves.toBeInstanceOf(Request)
    });
  });
  
  describe('retreatRequest', () => {
    // evoke requestsService.retreatRequest and don't expect an exception to be thrown
    it('Delete the corresponding request via its identifier.', () => {
      const result = requestsService.retreatRequest(
        mocks.offereeAccount,
        '29c58e6d-cdbf-4f41-bdbb-5d796d93f86e',
      );
      expect(result).resolves.toBeInstanceOf(Request)
    });
  });
});
