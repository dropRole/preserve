import { Body, Controller, Post } from '@nestjs/common';
import { RecordOfferorDTO } from 'src/offerors/dto/record-offeror.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/offeree/signup')
  offereeSignUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.offereeSignUp(authCredentialsDTO);
  }

  @Post('/offeror/signup')
  offerorSignUp(
    @Body('authCredentialsDTO') authCredentialsDTO: AuthCredentialsDTO,
    @Body('recordOfferorDTO') recordOfferorDTO: RecordOfferorDTO,
  ): Promise<void> {
    return this.authService.offerorSignUp(authCredentialsDTO, recordOfferorDTO);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
