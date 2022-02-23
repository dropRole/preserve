import { IsNotEmpty, IsString } from 'class-validator';

export class GetReservationsFilterDTO {
  @IsString()
  @IsNotEmpty()
  idOfferors: string;

  @IsString()
  @IsNotEmpty()
  todaysDate: string;
}
