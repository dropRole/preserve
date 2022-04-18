import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OffereesController } from './offerees.controller';
import { OffereesRepository } from './offerees.repository';
import { OffereesService } from './offerees.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([OffereesRepository]),
  ],
  controllers: [OffereesController],
  providers: [OffereesService],
  exports: [OffereesService],
})
export class OffereesModule {}
