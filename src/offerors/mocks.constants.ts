// mocks for offerors service unit testing

import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { Offeror } from './offeror.entity';

export const updateOfferorEmailDTO = new UpdateOfferorEmailDTO();
updateOfferorEmailDTO.email = 'lucifer@chocolate.com';

export const updateOfferorBusinessInfoDTO = new UpdateOfferorBusinessInfoDTO();
updateOfferorBusinessInfoDTO.address = 'Efenkova 61a';
updateOfferorBusinessInfoDTO.telephone = '+38670771406';
updateOfferorBusinessInfoDTO.businessHours = 'mon-sun 08-22';

export const offerorAccount = new Account();
offerorAccount.username = 'luciFer';
offerorAccount.password =
  '$2b$10$0CfAwEHTXO2DwQ/CMq0re.AH0G2qWssGt6Emf8XKPn7MuXoYDlU5y';
offerorAccount.privilege = Privilege.Offeror;
offerorAccount.complaints = [];

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

export const offerorsRepository = {
  insertOfferor: jest.fn().mockResolvedValue(offeror),
  selectOfferorById: jest.fn().mockResolvedValue(offeror),
  selectOfferorByUsername: jest.fn().mockResolvedValue(offeror),
  findOne: jest.fn().mockResolvedValue(offeror),
  updateOfferorEmail: jest.fn().mockResolvedValue(Promise.resolve()),
  updateOfferorBusinessInfo: jest.fn().mockResolvedValue(Promise.resolve()),
};
