import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';
import { RequestsModule } from '../requests/requests.module';
import { RequestsService } from '../requests/requests.service';
import { RequestsRepository } from 'src/requests/requests.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferorsModule } from 'src/offerors/offerors.module';
import { OfferorsService } from 'src/offerors/offerors.service';
import { OffereesModule } from 'src/offerees/offerees.module';
import { OffereesService } from 'src/offerees/offerees.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationsRepository, RequestsRepository]),
    forwardRef(() => RequestsModule),
    OfferorsModule,
    OffereesModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
