import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProhibitionsController } from './prohibitions.controller';
import { ProhibitionsService } from './prohibitions.service';
import { ProhibitionsRepository } from './prohibitons.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProhibitionsRepository])],
  controllers: [ProhibitionsController],
  providers: [ProhibitionsService],
})
export class ProhibitionsModule {}
