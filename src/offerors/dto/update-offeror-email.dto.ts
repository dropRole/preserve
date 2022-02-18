import { IsString } from 'class-validator';

export class UpdateOfferorEmailDTO {
  @IsString()
  email: string;
}
