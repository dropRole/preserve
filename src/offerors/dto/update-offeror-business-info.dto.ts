import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOfferorBusinessInfoDTO {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsNotEmpty()
  @IsString()
  businessHours: string;
}
