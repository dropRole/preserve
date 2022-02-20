import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ComplainDTO {
  @IsString()
  @IsNotEmpty()
  idRequests: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  counteredTo: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  written: string;
}
