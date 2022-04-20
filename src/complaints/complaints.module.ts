import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsRepository } from './complaints.repository';
import { ComplaintsService } from './complaints.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ComplaintsRepository]),
    ReservationsModule,
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
