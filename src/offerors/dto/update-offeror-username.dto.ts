import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateOfferorUsernameDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  username: string;
}
