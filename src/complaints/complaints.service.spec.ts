import { Test } from '@nestjs/testing';
import { ComplaintsService } from './complaints.service';
import { ComplaintsRepository } from './complaints.repository';
import { ReservationsService } from '../reservations/reservations.service';
import * as mocks from './mocks.constants';
import { Complaint } from './complaint.entity';

xdescribe('ComplaintsService', () => {
  let complaintsService: ComplaintsService;
  // before each test initialize dummy complaints module
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        {
          provide: ComplaintsRepository,
          useValue: mocks.complaintsRepository,
        },
        {
          provide: ReservationsService,
          useValue: mocks.reservationsService,
        },
      ],
    }).compile();
    complaintsService = module.get(ComplaintsService);
  });

  describe('complain', () => {
    it('Inserts a complaint into the repository and returns it.', () => {
      // evoke complaintsService.complain method and compare to the excpected value
      const result = complaintsService.complain(
        mocks.account,
        mocks.submitComplaintDTO,
      );
      expect(result).resolves.toEqual(Complaint);
    });
  });

  describe('getComplaints', () => {
    // evoke complaintsService.complain method and compare to the excpected value
    it('Get complaints according to the requestant account.', () => {
      const result = complaintsService.getComplaints(
        mocks.account,
        '4b320768-69a9-48a5-adaf-c102d6c093ae',
      );
      expect(result).resolves.toEqual([Complaint]);
    });
  });

  describe('reComplain', () => {
    // evoke complaintsService.complain method and expect to successfully execute
    it('Update content of the subject complaint.', () => {
      expect(complaintsService.reComplain).not.toThrow();
    });
  });
  
  describe('withdrawComplaint', () => {
    // evoke complaintsService.complain method and expect to successfully execute
    it('Withdraw publicated complaint on the reservation.', () => {
      expect(complaintsService.withdrawComplaint).not.toThrow();
    });
  });
});
