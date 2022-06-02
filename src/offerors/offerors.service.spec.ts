import { Test } from '@nestjs/testing';
import * as mocks from './mocks.constants';
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
        { provide: OfferorsRepository, useValue: mocks.offerorsRepository },
      ],
    }).compile();
    offerorsService = module.get(OfferorsService);
  });

  describe('recordAnOfferor', () => {
    // evoke offerorsService.recordAnOfferor and expect an Offeror instance
    it('Insert an offeror record into the offeror repository.', () => {
      const result = offerorsService.recordAnOfferor(
        mocks.offeror.name,
        mocks.offeror.address,
        mocks.offeror.email,
        mocks.offeror.telephone,
        mocks.offeror.businessHours,
        mocks.offeror.responsiveness,
        mocks.offeror.compliance,
        mocks.offeror.timeliness,
        mocks.offerorAccount,
      );
      expect(result).resolves.toBeInstanceOf(Offeror);
    });
  });

  describe('getOfferorById', () => {
    // evoke offerorsService.getOfferorById and expect an Offeror instance
    it('Select an offeror by the corresponding identifier from the offeror repository.', () => {
      const result = offerorsService.getOfferorById(mocks.offeror.idOfferors);
      expect(result).resolves.toBeInstanceOf(Offeror);
    });
  });

  describe('getOfferorByUsername', () => {
    // evoke offerorsService.getOfferorByUsername and expect an Offeror instance
    it('Select an offeror by the corresponding account username from the offeror repository.', () => {
      const result = offerorsService.getOfferorByUsername(
        mocks.offeror.account.username,
      );
      expect(result).resolves.toBeInstanceOf(Offeror);
    });
  });

  describe('updateOfferorEmail', () => {
    // evoke offerorsService.updateOfferorEmail and don't expect an exception to be thrown
    it('Update an offerors email with the passed address.', () => {
      const result = offerorsService.updateOfferorEmail(
        mocks.offerorAccount,
        mocks.updateOfferorEmailDTO,
      );
      expect(result).resolves.not.toThrow()
    });
  });
  
  describe('updateOfferorBusinessInfo', () => {
    // evoke offerorsService.updateOfferorBusinessInfo and don't expect an exception to be thrown
    it('Update the offerors business info.', () => {
      const result = offerorsService.updateOfferorBusinessInfo(
        mocks.offerorAccount,
        mocks.updateOfferorBusinessInfoDTO
      );
      expect(result).resolves.not.toThrow()
    });
  });
});
