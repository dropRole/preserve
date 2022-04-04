import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OfferorSignUpDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;

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

  @IsNumberString()
  @IsNotEmpty()
  responsiveness: number;

  @IsNumberString()
  @IsNotEmpty()
  compliance: number;

  @IsNumberString()
  @IsNotEmpty()
  timeliness: number;
}
