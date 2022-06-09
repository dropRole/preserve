// mock constants for unit testing of request module service

import { Privilege } from '../auth/enum/privilege.enum';
import { Account } from '../auth/account.entity';
import { RequestForReservationDTO } from './dto/request-for-reservartion.dto';
import { Offeror } from '../offerors/offeror.entity';
import { Offeree } from '../offerees/offeree.entity';
import { Request } from './request.entity';
import { GetRequestsFilterDTO } from './dto/get-requests-filter.dto';

export const offereeAccount = new Account();
offereeAccount.username = 'dropRole';
offereeAccount.password =
  '$2b$10$NtVW0e3tTtBEcH3ej53KFueNQJYVXngTyE3wQvFhuoA4guYAXt8jS';
offereeAccount.privilege = Privilege.Offeree;
offereeAccount.complaints = [];

const offerorAccount = new Account();
offerorAccount.username = 'luciFer';
offerorAccount.password =
  '$2b$10$0CfAwEHTXO2DwQ/CMq0re.AH0G2qWssGt6Emf8XKPn7MuXoYDlU5y';
offerorAccount.privilege = Privilege.Offeror;
offerorAccount.complaints = [];

const offeror = new Offeror();
offeror.idOfferors = '36cbb4d6-d187-4fb3-95cc-4730b189bf13';
offeror.account = offerorAccount;
offeror.name = 'Lucifer d.o.o';
offeror.address = 'Šaleška cesta 19a';
offeror.email = 'lucifer@gmail.com';
offeror.telephone = '03 580 720';
offeror.businessHours = 'pon-ned 07-22';
offeror.responsiveness = 10;
offeror.compliance = 10;
offeror.timeliness = 10;

const offeree = new Offeree();
offeree.account = offereeAccount;
offeree.email = 'dusan.radosavljevic82@gmail.com';

export const requestForReservationDTO = new RequestForReservationDTO();
requestForReservationDTO.idOfferors = '36cbb4d6-d187-4fb3-95cc-4730b189bf13';
requestForReservationDTO.seats = 3;
requestForReservationDTO.cause = 'Randevouz';
requestForReservationDTO.requestedAt = (+new Date()).toString();
requestForReservationDTO.requestedAt = (+new Date(
  new Date().getHours() + 2,
)).toString();
requestForReservationDTO.note = 'Anticipate snogging.';

export const getRequestsFilterDTO = new GetRequestsFilterDTO();
getRequestsFilterDTO.todaysDate = new Date().toDateString();

export const requestsRepository = {
  insertRequest: jest.fn().mockResolvedValue(new Request()),
  selectRequests: jest.fn().mockResolvedValue([new Request(), new Request()]),
  selectRequest: jest.fn().mockResolvedValue(new Request()),
  deleteRequest: jest.fn().mockResolvedValue(new Request()),
};

export const reservationsRepository = {};

export const offerorsService = {
  getOfferorById: jest.fn().mockResolvedValue(offeror),
};

export const offereesService = {
  getOffereeByUsername: jest.fn().mockResolvedValue(offeree),
};
