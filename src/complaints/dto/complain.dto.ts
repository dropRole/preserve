import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ComplainDTO {
  @IsString()
  @IsNotEmpty()
  idRequests: string;

  @IsString()
  @IsNotEmpty()
  username: string;

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
