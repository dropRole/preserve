import { Test } from '@nestjs/testing';
import { ComplaintsService } from './complaints.service';
import { ComplaintsRepository } from './complaints.repository';
import { ReservationsService } from '../reservations/reservations.service';
import {
  mockComplaintsRepository,
  mockAccount,
  mockSubmitComplaintDTO,
  mockReservationsService,
  mockReSubmitComplaintDTO,
} from './testing-mocks';
import { Complaint } from './complaint.entity';

describe('ComplaintsService', () => {
  let complaintsService: ComplaintsService;
  let complaintsRepository;
  // before each test initialize dummy module composed of ComplaintsService and ComplaitnsRepository
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        {
          provide: ComplaintsRepository,
          useFactory: mockComplaintsRepository,
        },
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();
    complaintsService = module.get(ComplaintsService);
    complaintsRepository = module.get(ComplaintsRepository);
  });

  describe('complain', () => {
    it('Inserts a complaint into the repository and returns it.', () => {
      // evoke complaintsService.complain method and compare to the excpected value
      const result = complaintsService.complain(
        mockAccount,
        mockSubmitComplaintDTO,
      );
      expect(result).resolves.toEqual(Complaint);
    });
  });

  describe('getComplaints', () => {
    // evoke complaintsService.complain method and compare to the excpected value
    it('Get complaints according to the requestant account.', () => {
      const result = complaintsService.getComplaints(
        mockAccount,
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
