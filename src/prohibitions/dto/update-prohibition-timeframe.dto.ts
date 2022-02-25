import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProhibitionTimeframeDTO {
  @IsString()
  @IsNotEmpty()
  beginning: string;

  @IsString()
  @IsNotEmpty()
  conclusion: string;
}
