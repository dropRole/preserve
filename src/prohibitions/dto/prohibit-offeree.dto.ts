import { IsNotEmpty, IsString } from 'class-validator';
import { Offeree } from 'src/offerees/offeree.entity';
import { Offeror } from 'src/offerors/offeror.entity';

export class ProhibitOffereeDTO {
  offeree: Offeree;

  offeror: Offeror;

  @IsString()
  @IsNotEmpty()
  beginning: string;

  @IsString()
  @IsNotEmpty()
  conclusion: string;

  @IsString()
  @IsNotEmpty()
  cause: string;
}
