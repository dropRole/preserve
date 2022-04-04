import { Body, Controller, Post } from '@nestjs/common';
import { RecordOfferorDTO } from 'src/offerors/dto/record-offeror.dto';
import { Account } from './account.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/offeree/signup')
  offereeSignUp(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<Account> {
    return this.authService.offereeSignUp(authCredentialsDTO);
  }

  @Post('/offeror/signup')
  offerorSignUp(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<Account> {
    return this.authService.offerorSignUp(authCredentialsDTO);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
