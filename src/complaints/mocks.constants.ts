import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { SubmitComplaintDTO } from './dto/submit-complaint';
import { Reservation } from '../reservations/reservation.entity';
import { Complaint } from './complaint.entity';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';

export const account = new Account();
account.username = 'dropRole';
account.password =
  '$2b$10$NtVW0e3tTtBEcH3ej53KFueNQJYVXngTyE3wQvFhuoA4guYAXt8jS';
account.privilege = Privilege.Offeree;

export const submitComplaintDTO = new SubmitComplaintDTO();
submitComplaintDTO.idReservations = '4b320768-69a9-48a5-adaf-c102d6c093ae';
submitComplaintDTO.content = 'Mock complaint';

export const reSubmitComplaintDTO = new ReSubmitComplaintDTO();
reSubmitComplaintDTO.idComplaints = '62b0bdd5-f265-4f4d-a96a-449a7e363fa7';
reSubmitComplaintDTO.content = 'Amended content.';

export const reservation = new Reservation();
reservation.code = '275d20b3';
reservation.request = null;
reservation.confirmedAt = new Date('2022-04-25 15:43:11.735983');
reservation.complaints = [];

export const complaintsRepository = {
  findOne: jest.fn().mockResolvedValue(undefined),
  insertComplaint: jest.fn().mockResolvedValue(Promise.resolve(Complaint)),
  selectComplaints: jest.fn().mockResolvedValue(Promise.resolve([Complaint])),
  reComplain: jest.fn().mockResolvedValue(Promise.resolve()),
  withdrawComplaint: jest.fn().mockResolvedValue(Promise.resolve()),
};

export const reservationsService = {
  reserve: jest.fn(),
  getReservation: jest.fn().mockResolvedValue(reservation),
  getReservations: jest.fn().mockResolvedValue(reservation),
  deleteReservations: jest.fn().mockResolvedValue(reservation),
};
