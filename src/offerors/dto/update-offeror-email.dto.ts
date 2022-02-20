import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOfferorEmailDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
