import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsRepository } from './complaints.repository';
import { ComplaintsService } from './complaints.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintsRepository])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
