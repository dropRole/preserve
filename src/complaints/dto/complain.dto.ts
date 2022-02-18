import { IsNotEmpty, IsOptional } from 'class-validator';

export class ComplainDTO {
  @IsNotEmpty()
  idRequests: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  counteredTo: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  written: string;
}
