import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitComplaintDTO {
  @IsString()
  @IsNotEmpty()
  idRequests: string;

  @IsOptional()
  @IsString()
  counteredTo: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  written: string;
}
