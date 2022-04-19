import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';
import { RequestsModule } from '../requests/requests.module';
import { RequestsRepository } from 'src/requests/requests.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferorsModule } from 'src/offerors/offerors.module';
import { OffereesModule } from 'src/offerees/offerees.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
