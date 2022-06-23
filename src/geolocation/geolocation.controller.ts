import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { Privileges } from 'src/auth/privilege.decorator';
import { GeolocationService } from './geolocation.service';

UseGuards(AuthGuard);
@Controller('geolocation')
export class GeolocationController {
  constructor(private geolocationService: GeolocationService) {}

  @Get('/geocoding')
  @Privileges(Privilege.Offeree)
  forwardGeocoding(
    @Query('lat') latitude: string,
    @Query('long') longitude: string,
  ): Observable<{}> {
    return this.geolocationService.forwardGeocoding(latitude, longitude);
  }
}
