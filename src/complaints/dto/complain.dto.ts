import { IsNotEmpty, IsOptional } from 'class-validator';

export class ComplainDTO {
  @IsNotEmpty()
  id_requests: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  countered_to: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  written: string;
}
