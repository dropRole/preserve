import { Test } from '@nestjs/testing';
import * as mocks from './mocks.constants';
import { Offeree } from './offeree.entity';
import { OffereesRepository } from './offerees.repository';
import { OffereesService } from './offerees.service';

xdescribe('offereesService', () => {
  let offereesService: OffereesService;
  // before each test initialize dummy offerees module
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OffereesService,
        {
          provide: OffereesRepository,
          useValue: mocks.offereesRepository,
        },
      ],
    }).compile();
    offereesService = module.get(OffereesService);
  });

  describe('recordAnOfferee', () => {
    // evoke offereesService.recordAnOfferee and expect an Offeree instance
    it('Insert an offeree record into the offerees repository.', () => {
      const result = offereesService.recordAnOfferee(mocks.offereeAccount);
      expect(result).resolves.toBeInstanceOf(Offeree);
    });
  });

  describe('getOffereeById', () => {
    // evoke offereesService.getOffereeById and expect an Offeree instance
    it('Select an offeree record by the passed identifier from the offerees repository.', () => {
      const result = offereesService.getOffereeById(
        '7d8c58ac-c0f2-46d1-b000-dc2edf01ba4d',
      );
      expect(result).resolves.toBeInstanceOf(Offeree);
    });
  });

  describe('getOffereeByUsername', () => {
    // evoke offereesService.getOffereeByUsername and expect an Offeree instance
    it('Select an offeree record by the corresponding offerees account username from the offerees repository.', () => {
      const result = offereesService.getOffereeByUsername('denisHabot');
      expect(result).resolves.toBeInstanceOf(Offeree);
    });
  });

  describe('updateOffereeEmail', () => {
    // evoke offereesService.updateOffereeEmail and don't expect an exception to be thrown
    it('Update offerees email with the provided address.', () => {
      const result = offereesService.updateOffereeEmail(
        mocks.offereeAccount,
        mocks.updateOffereeEmailDTO,
      );
      expect(result).resolves.not.toThrow();
    });
  });
});
