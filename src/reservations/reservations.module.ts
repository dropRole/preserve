import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';
import { RequestsModule } from '../requests/requests.module';
import { RequestsService } from '../requests/requests.service';
import { RequestsRepository } from 'src/requests/requests.repository';

@Module({
  imports: [RequestsModule],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsRepository,
    RequestsService,
    RequestsRepository,
  ],
  exports: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
