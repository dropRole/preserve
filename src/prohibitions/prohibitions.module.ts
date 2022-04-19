import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProhibitionsController } from './prohibitions.controller';
import { ProhibitionsService } from './prohibitions.service';
import { ProhibitionsRepository } from './prohibitons.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ProhibitionsRepository])],
  controllers: [ProhibitionsController],
  providers: [ProhibitionsService],
})
export class ProhibitionsModule {}
