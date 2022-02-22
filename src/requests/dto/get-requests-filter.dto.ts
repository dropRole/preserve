import { IsNotEmpty, IsString } from 'class-validator';

export class GetRequestsFilterDTO {
  @IsString()
  @IsNotEmpty()
  idOfferors: string;

  @IsString()
  @IsNotEmpty()
  todaysDate: string;
}
