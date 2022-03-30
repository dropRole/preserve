import { IsNotEmpty, IsString } from 'class-validator';
import { Request } from '../../requests/request.entity';

export class MakeReservationDTO {
  request: Request;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  confirmedAt: string;
}
