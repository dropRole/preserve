import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsRepository } from 'src/reservations/reservations.repository';
import { ReservationsService } from 'src/reservations/reservations.service';
import { RequestsController } from './requests.controller';
import { RequestsRepository } from './requests.repository';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestsRepository]),
    forwardRef(() => ReservationsModule),
  ],
  controllers: [RequestsController],
  providers: [
    RequestsService,
    RequestsRepository,
    ReservationsService,
    ReservationsRepository,
  ],
  exports: [RequestsService, RequestsRepository],
})
export class RequestsModule {}
