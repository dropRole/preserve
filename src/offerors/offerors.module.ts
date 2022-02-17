import { Module } from '@nestjs/common';
import { OfferorsController } from './offerors.controller';
import { OfferorsService } from './offerors.service';

@Module({
  controllers: [OfferorsController],
  providers: [OfferorsService],
})
export class OfferorsModule {}
