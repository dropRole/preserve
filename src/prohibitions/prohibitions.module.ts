import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OffereesModule } from '../offerees/offerees.module';
import { OfferorsModule } from '../offerors/offerors.module';
import { ProhibitionsController } from './prohibitions.controller';
import { ProhibitionsService } from './prohibitions.service';
import { ProhibitionsRepository } from './prohibitons.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProhibitionsRepository]),
    OfferorsModule,
    OffereesModule,
  ],
  controllers: [ProhibitionsController],
  providers: [ProhibitionsService],
})
export class ProhibitionsModule {}
