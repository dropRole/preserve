import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffereesController } from './offerees.controller';
import { OffereesRepository } from './offerees.repository';
import { OffereesService } from './offerees.service';

@Module({
  imports: [TypeOrmModule.forFeature([OffereesRepository])],
  controllers: [OffereesController],
  providers: [OffereesService, OffereesRepository],
  exports: [OffereesService, OffereesRepository],
})
export class OffereesModule {}
