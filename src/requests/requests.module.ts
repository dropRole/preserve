import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OffereesModule } from '../offerees/offerees.module';
import { OfferorsModule } from '../offerors/offerors.module';
import { ReservationsRepository } from '../reservations/reservations.repository';
import { RequestsController } from './requests.controller';
import { RequestsRepository } from './requests.repository';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestsRepository, ReservationsRepository]),
    AuthModule,
    OfferorsModule,
    OffereesModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
