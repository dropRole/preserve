// mocks for offerors service unit testing

import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { Offeror } from './offeror.entity';

export const mockUpdateOfferorEmailDTO = new UpdateOfferorEmailDTO();
mockUpdateOfferorEmailDTO.email = 'lucifer@chocolate.com';

export const mockUpdateOfferorBusinessInfoDTO =
  new UpdateOfferorBusinessInfoDTO();
mockUpdateOfferorBusinessInfoDTO.address = 'Efenkova 61a';
mockUpdateOfferorBusinessInfoDTO.telephone = '+38670771406';
mockUpdateOfferorBusinessInfoDTO.businessHours = 'mon-sun 08-22';

export const mockOfferorAccount = new Account();
mockOfferorAccount.username = 'luciFer';
mockOfferorAccount.password =
  '$2b$10$0CfAwEHTXO2DwQ/CMq0re.AH0G2qWssGt6Emf8XKPn7MuXoYDlU5y';
mockOfferorAccount.privilege = Privilege.Offeror;
mockOfferorAccount.complaints = [];

export const mockOfferor = new Offeror();
mockOfferor.idOfferors = '36cbb4d6-d187-4fb3-95cc-4730b189bf13';
mockOfferor.account = mockOfferorAccount;
mockOfferor.name = 'Lucifer d.o.o';
mockOfferor.address = 'Šaleška cesta 19a';
mockOfferor.email = 'lucifer@gmail.com';
mockOfferor.telephone = '03 580 720';
mockOfferor.businessHours = 'pon-ned 07-22';
mockOfferor.responsiveness = 10;
mockOfferor.compliance = 10;
mockOfferor.timeliness = 10;

export const mockOfferorsRepository = {
  insertOfferor: jest.fn().mockResolvedValue(mockOfferor),
  selectOfferorById: jest.fn().mockResolvedValue(mockOfferor),
  selectOfferorByUsername: jest.fn().mockResolvedValue(mockOfferor),
  findOne: jest.fn().mockResolvedValue(mockOfferor),
  updateOfferorEmail: jest.fn().mockResolvedValue(Promise.resolve()),
};
