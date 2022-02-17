import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsRepository } from './complaints.repository';
import { ComplaintsService } from './complaints.service';

@Module({
  controllers: [ComplaintsController],
  providers: [ComplaintsService, ComplaintsRepository],
})
export class ComplaintsModule {}
