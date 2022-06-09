// mock objects for reservations service unit testing

import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { Offeree } from '../offerees/offeree.entity';
import { Offeror } from '../offerors/offeror.entity';
import { Request } from '../requests/request.entity';
import { GetReservationsFilterDTO } from './dto/get-reservations-filter.dto';
import { MakeReservationDTO } from './dto/make-reservation.dto';
import { Reservation } from './reservation.entity';

export const account = new Account();
account.username = 'luciFer';
account.password =
  '$2b$10$0CfAwEHTXO2DwQ/CMq0re.AH0G2qWssGt6Emf8XKPn7MuXoYDlU5y';
account.privilege = Privilege.Offeror;
account.complaints = [];

const request = new Request();
request.idRequests = '29c58e6d-cdbf-4f41-bdbb-5d796d93f86e';
request.offeree = new Offeree();
request.offeror = new Offeror();
request.requestedAt = new Date();
request.requestedFor = new Date(new Date().getHours() + 2);
request.seats = 2;
request.cause = 'Employment';
request.note = 'Band included';

const reservation = new Reservation();
reservation.request = request;
reservation.confirmedAt = new Date(request.requestedAt.getHours() - 1);
reservation.code = '275d20b3';
reservation.complaints = [];

export const makeReservationDTO = new MakeReservationDTO();
makeReservationDTO.idRequests = request.idRequests;

export const getReservationFilterDTO = new GetReservationsFilterDTO();
getReservationFilterDTO.todaysDate = new Date().toDateString();

export const requestsService = {
  getRequestById: jest.fn().mockResolvedValue(request),
};

export const reservationsRepository = {
  insertReservation: jest.fn().mockResolvedValue(new Reservation()),
  selectReservations: jest
    .fn()
    .mockResolvedValue([new Reservation(), new Reservation()]),
  selectReservation: jest.fn().mockResolvedValue(reservation),
  deleteReservation: jest.fn().mockResolvedValue(Promise.resolve()),
};
