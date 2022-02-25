import { IsNotEmpty, IsString } from 'class-validator';

export class ProhibitOffereeDTO {
  @IsString()
  @IsNotEmpty()
  idOfferors: string;

  @IsString()
  @IsNotEmpty()
  idOfferees: string;

  @IsString()
  @IsNotEmpty()
  beginning: string;

  @IsString()
  @IsNotEmpty()
  conclusion: string;

  @IsString()
  @IsNotEmpty()
  cause: string;
}
