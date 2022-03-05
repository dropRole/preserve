import { IsNotEmpty, IsString } from 'class-validator';

export class RecordOfferorDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  businessHours: string;

  @IsString()
  @IsNotEmpty()
  responsiveness: number;

  @IsString()
  @IsNotEmpty()
  compliance: number;

  @IsString()
  @IsNotEmpty()
  timeliness: number;
}
