import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitComplaintDTO {
  @IsString()
  @IsNotEmpty()
  idReservations: string;

  @IsOptional()
  @IsString()
  counteredComplaint: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
