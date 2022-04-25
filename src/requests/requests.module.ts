import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OffereesModule } from 'src/offerees/offerees.module';
import { OfferorsModule } from 'src/offerors/offerors.module';
import { ReservationsRepository } from 'src/reservations/reservations.repository';
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
