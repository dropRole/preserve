import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';

@Injectable()
export class GeolocationService {
  private LOCATIONIQ_API_KEY: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.LOCATIONIQ_API_KEY = this.configService.get('LOCATIONIQ_API_KEY');
  }

  forwardGeocoding(latitude: string, longitude: string): Observable<{}> {
    return this.httpService
      .get(
        `https://eu1.locationiq.com/v1/reverse?key=${this.LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`,
      )
      .pipe(map((response) => response.data));
  }
}
