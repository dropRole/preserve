import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AuthCredentialsDTO } from './auth-credentials.dto';

export class OfferorSignUpDTO {
  authCredentialsDTO: AuthCredentialsDTO;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  businessHours: string;

  @IsNumber()
  @IsNotEmpty()
  responsiveness: number;

  @IsNumber()
  @IsNotEmpty()
  compliance: number;

  @IsNumber()
  @IsNotEmpty()
  timeliness: number;
}
