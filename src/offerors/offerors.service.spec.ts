import { Test } from '@nestjs/testing';
import {
  mockOfferor,
  mockOfferorAccount,
  mockOfferorsRepository,
  mockUpdateOfferorBusinessInfoDTO,
  mockUpdateOfferorEmailDTO,
} from './mocks.constants';
import { Offeror } from './offeror.entity';
import { OfferorsRepository } from './offerors.repository';
import { OfferorsService } from './offerors.service';

describe('offerorsService', () => {
  let offerorsService: OfferorsService;
  // before each test instantiate the dummy offerors module
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OfferorsService,
        { provide: OfferorsRepository, useValue: mockOfferorsRepository },
      ],
    }).compile();
    offerorsService = module.get(OfferorsService);
  });

  describe('recordAnOfferor', () => {
    // evoke offerorsService.recordAnOfferor and expect an Offeror instance
    it('Insert an offeror record into the offeror repository.', () => {
      const result = offerorsService.recordAnOfferor(
        mockOfferor.name,
        mockOfferor.address,
        mockOfferor.email,
        mockOfferor.telephone,
        mockOfferor.businessHours,
        mockOfferor.responsiveness,
        mockOfferor.compliance,
        mockOfferor.timeliness,
        mockOfferorAccount,
      );
      expect(result).resolves.toBeInstanceOf(Offeror);
    });
  });

  describe('getOfferorById', () => {
    // evoke offerorsService.getOfferorById and expect an Offeror instance
    it('Select an offeror by the corresponding identifier from the offeror repository.', () => {
      const result = offerorsService.getOfferorById(mockOfferor.idOfferors);
      expect(result).resolves.toBeInstanceOf(Offeror);
    });
  });

  describe('getOfferorByUsername', () => {
    // evoke offerorsService.getOfferorByUsername and expect an Offeror instance
    it('Select an offeror by the corresponding account username from the offeror repository.', () => {
      const result = offerorsService.getOfferorByUsername(
        mockOfferor.account.username,
      );
      expect(result).resolves.toBeInstanceOf(Offeror);
    });
  });

  describe('updateOfferorEmail', () => {
    // evoke offerorsService.updateOfferorEmail and don't expect an exception to be thrown
    it('Update an offerors email with the passed address.', () => {
      const result = offerorsService.updateOfferorEmail(
        mockOfferorAccount,
        mockUpdateOfferorEmailDTO,
      );
      expect(result).resolves.not.toThrow()
    });
  });
  
  describe('updateOfferorBusinessInfo', () => {
    // evoke offerorsService.updateOfferorBusinessInfo and don't expect an exception to be thrown
    it('Update the offerors business info.', () => {
      const result = offerorsService.updateOfferorBusinessInfo(
        mockOfferorAccount,
        mockUpdateOfferorBusinessInfoDTO
      );
      expect(result).resolves.not.toThrow()
    });
  });
});
