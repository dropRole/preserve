import { Module } from '@nestjs/common';
import { OfferorsController } from './offerors.controller';
import { OfferorsRepository } from './offerors.repository';
import { OfferorsService } from './offerors.service';

@Module({
  controllers: [OfferorsController],
  providers: [OfferorsService, OfferorsRepository],
})
export class OfferorsModule {}
