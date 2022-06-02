// s for unit testing ProhibitionsService
import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { Offeree } from '../offerees/offeree.entity';
import { Offeror } from '../offerors/offeror.entity';
import { UpdateProhibitionTimeframeDTO } from './dto/update-prohibition-timeframe.dto';
import { Prohibition } from './prohibitions.entity';

const offerorAccount = new Account();
offerorAccount.username = 'luciFer';
offerorAccount.password =
  '$2b$10$0CfAwEHTXO2DwQ/CMq0re.AH0G2qWssGt6Emf8XKPn7MuXoYDlU5y';
offerorAccount.privilege = Privilege.Offeror;
offerorAccount.complaints = [];

const offereeAccount = new Account();
offereeAccount.username = 'denisHabot';
offereeAccount.password =
  '$2b$10$2zztuoXZPSoQQrkjGl9kx.mEedirYtuZLrSC8dke5W6psTMh5hn9W';
offereeAccount.privilege = Privilege.Offeree;
offereeAccount.complaints = [];

export const offeror = new Offeror();
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

export const updateProhibitionTimeFrameDTO =
  new UpdateProhibitionTimeframeDTO();
updateProhibitionTimeFrameDTO.beginning = new Date().toDateString();
updateProhibitionTimeFrameDTO.conclusion = new Date(
  new Date().getDate() + 2,
).toDateString();

export const offeree = new Offeree();
offeree.idOfferees = '7d8c58ac-c0f2-46d1-b000-dc2edf01ba4d';
offeree.account = offereeAccount;
offeree.email = 'denishabot@gmail.com';

export const prohibitionsRepository = {
  insertProhibition: jest.fn().mockResolvedValue(new Prohibition()),
  selectProhibitions: jest
    .fn()
    .mockResolvedValue([new Prohibition(), new Prohibition()]),
  selectProhibition: jest.fn().mockResolvedValue(new Prohibition()),
  updateProhibition: jest.fn().mockResolvedValue(Promise.resolve()),
  deleteProhibition: jest.fn().mockResolvedValue(Promise.resolve()),
};

export const offerorsService = {
  getOfferorById: jest.fn().mockResolvedValue(Offeror),
};

export const offereesService = {
  getOffereeById: jest.fn().mockResolvedValue(Offeree),
};
