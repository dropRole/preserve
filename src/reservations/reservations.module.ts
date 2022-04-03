import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';
import { RequestsModule } from '../requests/requests.module';
import { RequestsService } from '../requests/requests.service';
import { RequestsRepository } from 'src/requests/requests.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationsRepository, RequestsRepository]),
    forwardRef(() => RequestsModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, RequestsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
