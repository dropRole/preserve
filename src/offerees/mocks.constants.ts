// mock constants and provider instances for testing offereesService

import { Privilege } from '../auth/enum/privilege.enum';
import { Account } from '../auth/account.entity';
import { Offeree } from './offeree.entity';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';

export const offereeAccount = new Account();
offereeAccount.username = 'denisHabot';
offereeAccount.password =
  '$2b$10$2zztuoXZPSoQQrkjGl9kx.mEedirYtuZLrSC8dke5W6psTMh5hn9W';
offereeAccount.privilege = Privilege.Offeree;
offereeAccount.complaints = [];

export const offeree = new Offeree();
offeree.idOfferees = '7d8c58ac-c0f2-46d1-b000-dc2edf01ba4d';
offeree.email = null;
offeree.account = offereeAccount;
offeree.prohibitions = [];
offeree.requests = [];

export const updateOffereeEmailDTO = new UpdateOffereeEmailDTO();
updateOffereeEmailDTO.email = 'denis.habot@gmail.com';

export const offereesRepository = {
  insertOfferee: jest.fn().mockResolvedValue(offeree),
  findOne: jest.fn().mockResolvedValue(offeree),
  updateOffereeEmail: jest.fn(),
};
