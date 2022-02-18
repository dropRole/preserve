import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateOffereeEmailDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
