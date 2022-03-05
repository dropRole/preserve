import { Body, Controller, Post } from '@nestjs/common';
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
  offerorSignUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.offerorSignUp(authCredentialsDTO);
  }

  @Post('/signin')
  offereeSignIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.offereeSignIn(authCredentialsDTO);
  }
}
