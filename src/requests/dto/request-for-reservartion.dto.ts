import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Offeree } from 'src/offerees/offeree.entity';
import { Offeror } from 'src/offerors/offeror.entity';

export class RequestForReservationDTO {
  offeror: Offeror;

  offeree: Offeree;

  @IsString()
  @IsNotEmpty()
  requestedAt: string;

  @IsString()
  @IsNotEmpty()
  requestedFor: string;

  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @IsString()
  @IsNotEmpty()
  cause: string;

  @IsOptional()
  @IsString()
  note: string;
}
