import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class OffereeAuthCredentialsDTO {
  @IsString()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
