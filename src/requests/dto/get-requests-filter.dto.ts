import { IsNotEmpty, IsString } from 'class-validator';

export class GetRequestsFilterDTO {
  @IsString()
  @IsNotEmpty()
  todaysDate: string;
}
