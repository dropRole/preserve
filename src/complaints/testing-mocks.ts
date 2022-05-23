import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { SubmitComplaintDTO } from './dto/submit-complaint';
import { Reservation } from '../reservations/reservation.entity';
import { Complaint } from './complaint.entity';

export const mockAccount = new Account();
mockAccount.username = 'dropRole';
mockAccount.password =
  '$2b$10$NtVW0e3tTtBEcH3ej53KFueNQJYVXngTyE3wQvFhuoA4guYAXt8jS';
mockAccount.privilege = Privilege.Offeree;

export const mockSubmitComplaintDTO = new SubmitComplaintDTO();
mockSubmitComplaintDTO.idReservations = '4b320768-69a9-48a5-adaf-c102d6c093ae';
mockSubmitComplaintDTO.content = 'Mock complaint';

export const mockReservation = new Reservation();
mockReservation.code = '275d20b3';
mockReservation.request = null;
mockReservation.confirmedAt = new Date('2022-04-25 15:43:11.735983');
mockReservation.complaints = [];

export const mockComplaintsRepository = () => ({
  findOne: jest.fn().mockResolvedValue(undefined),
  insertComplaint: jest.fn().mockResolvedValue(Complaint),
});

export const mockReservationsService = {
  reserve: jest.fn(),
  getReservation: jest.fn().mockResolvedValue(mockReservation),
  getReservations: jest.fn().mockResolvedValue(mockReservation),
  deleteReservations: jest.fn().mockResolvedValue(mockReservation),
};
