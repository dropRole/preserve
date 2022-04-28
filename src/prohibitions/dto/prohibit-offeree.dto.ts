import { IsNotEmpty, IsString } from 'class-validator';

export class ProhibitOffereeDTO {
  @IsNotEmpty()
  @IsString()
  idOfferees: string;

  @IsNotEmpty()
  @IsString()
  idOfferors: string;

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
