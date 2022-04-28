import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OffereesModule } from 'src/offerees/offerees.module';
import { OfferorsModule } from 'src/offerors/offerors.module';
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
