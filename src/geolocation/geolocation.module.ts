import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [GeolocationController],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
