import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class RequestForReservationDTO {
  @IsString()
  @IsNotEmpty()
  idOfferors: string;

  @IsString()
  @IsNotEmpty()
  requestedAt: string;

  @IsString()
  @IsNotEmpty()
  requestedFor: string;

  @IsNumberString()
  @IsNotEmpty()
  seats: number;

  @IsString()
  @IsNotEmpty()
  cause: string;

  @IsOptional()
  @IsString()
  note: string;
}
