import { IsNotEmpty, IsString } from 'class-validator';

export class GetReservationsFilterDTO {
  @IsString()
  @IsNotEmpty()
  todaysDate: string;
}
