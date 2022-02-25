import { IsNotEmpty, IsString } from 'class-validator';

export class ReSubmitComplaintDTO {
  @IsString()
  @IsNotEmpty()
  idComplaints: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
