import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferorsController } from './offerors.controller';
import { OfferorsRepository } from './offerors.repository';
import { OfferorsService } from './offerors.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfferorsRepository])],
  controllers: [OfferorsController],
  providers: [OfferorsService],
  exports: [OfferorsService],
})
export class OfferorsModule {}
