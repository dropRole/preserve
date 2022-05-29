// mock constants and provider instances for testing offereesService

import { Privilege } from '../auth/enum/privilege.enum';
import { Account } from '../auth/account.entity';
import { Offeree } from './offeree.entity';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';

export const mockOffereeAccount = new Account();
mockOffereeAccount.username = 'denisHabot';
mockOffereeAccount.password =
  '$2b$10$2zztuoXZPSoQQrkjGl9kx.mEedirYtuZLrSC8dke5W6psTMh5hn9W';
mockOffereeAccount.privilege = Privilege.Offeree;
mockOffereeAccount.complaints = [];

export const mockOfferee = new Offeree();
mockOfferee.idOfferees = '7d8c58ac-c0f2-46d1-b000-dc2edf01ba4d';
mockOfferee.email = null;
mockOfferee.account = mockOffereeAccount;
mockOfferee.prohibitions = [];
mockOfferee.requests = [];

export const mockUpdateOffereeEmailDTO = new UpdateOffereeEmailDTO()
mockUpdateOffereeEmailDTO.email = 'denis.habot@gmail.com'

export const mockOffereesRepository = {
  insertOfferee: jest.fn().mockResolvedValue(mockOfferee),
  findOne: jest.fn().mockResolvedValue(mockOfferee),
  updateOffereeEmail: jest.fn(),
};
