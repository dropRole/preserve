import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateOfferorBusinessInfoDTO {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumberString()
  telephone: string;
 
  @IsNotEmpty()
  @IsNumberString()
  businessHours: string;
}
