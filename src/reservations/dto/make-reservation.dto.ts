import { IsNotEmpty, IsString } from 'class-validator';

export class MakeReservationDTO {
  @IsString()
  @IsNotEmpty()
  idRequests: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  confirmedAt: string;
}
