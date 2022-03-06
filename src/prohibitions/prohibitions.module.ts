import { Module } from '@nestjs/common';
import { ProhibitionsController } from './prohibitions.controller';
import { ProhibitionsService } from './prohibitions.service';
import { ProhibitionsRepository } from './prohibitons.repository';

@Module({
  controllers: [ProhibitionsController],
  providers: [ProhibitionsService, ProhibitionsRepository],
})
export class ProhibitionsModule {}
