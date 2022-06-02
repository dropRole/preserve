import { Test } from '@nestjs/testing';
import { ProhibitionsService } from './prohibitions.service';
import { ProhibitionsRepository } from './prohibitons.repository';
import * as mocks from './mocks.constants';
import { OfferorsService } from '../offerors/offerors.service';
import { OffereesService } from '../offerees/offerees.service';
import { ProhibitOffereeDTO } from './dto/prohibit-offeree.dto';
import { Prohibition } from './prohibitions.entity';

xdescribe('prohibitionsService', () => {
  let prohibitionsService: ProhibitionsService;
  // instantiate dummy prohibitions module before running tests
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProhibitionsService,
        {
          provide: OfferorsService,
          useValue: mocks.offerorsService,
        },
        {
          provide: OffereesService,
          useValue: mocks.offereesService,
        },
        {
          provide: ProhibitionsRepository,
          useValue: mocks.prohibitionsRepository,
        },
      ],
    }).compile();
    prohibitionsService = module.get(ProhibitionsService);
  });

  describe('prohibitAnOfferee', () => {
    // evoke prohibitionsService.prohibitAnOfferee and expect an Prohibition instance
    it('Insert prohibition of the given offeree for the given offeror.', () => {
      const prohibitOffereeDto = new ProhibitOffereeDTO();
      prohibitOffereeDto.beginning = new Date().toDateString();
      prohibitOffereeDto.conclusion = new Date(
        new Date().getDate() + 2,
      ).toDateString();
      prohibitOffereeDto.idOfferors = mocks.offeror.idOfferors;
      prohibitOffereeDto.idOfferees = mocks.offeree.idOfferees;
      prohibitOffereeDto.cause = 'Incompliant.';
      const result = prohibitionsService.prohibitAnOfferee(prohibitOffereeDto);
      expect(result).resolves.toBeInstanceOf(Prohibition);
    });
  });

  describe('getProhibitions', () => {
    // evoke prohibitionsService.getProhibitions and expect an array of Prohibition instances
    it('Select prohibitions for the given offeror.', () => {
      const result = prohibitionsService.getProhibitions(
        mocks.offeror.idOfferors,
      );
      expect(result).resolves.toBeInstanceOf(Array);
    });
  });

  describe('getProhibition', () => {
    // evoke prohibitionsService.getProhibition and expect an Prohibition instance
    it('Select the corresponding prohibition, by the passed identifier, from the prohibition repository.', () => {
      const result = prohibitionsService.getProhibition(
        '991ce0ba-dcdb-41f8-8009-403f043d8784',
      );
      expect(result).resolves.toBeInstanceOf(Prohibition);
    });
  });

  describe('updateProhibitionTimeframe', () => {
    // evoke prohibitionsService.updateProhibitionTimeframe and don't expect an exception to be thrown
    it('Update the timeframe of the subject prohibiton.', () => {
      const result = prohibitionsService.updateProhibitionTimeframe(
        '991ce0ba-dcdb-41f8-8009-403f043d8784',
        mocks.updateProhibitionTimeFrameDTO,
      );
      expect(result).resolves.not.toThrow();
    });
  });

  describe('deleteProhibition', () => {
    // evoke prohibitionsService.deleteProhibition and don't expect an exception to be thrown
    it('Delete the given prohibition from the repository.', () => {
      const result = prohibitionsService.deleteProhibition(
        '991ce0ba-dcdb-41f8-8009-403f043d8784',
      );
      expect(result).resolves.not.toThrow();
    });
  });
});
