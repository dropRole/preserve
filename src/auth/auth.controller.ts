import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { OfferorSignUpDTO } from './dto/offeror-signup.dto';
import { Privilege } from './enum/privilege.enum';
import { Privileges } from './privilege.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/offeree/signup')
  offereeSignUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.offereeSignUp(authCredentialsDTO);
  }

  @Post('/offeror/signup')
  @Privileges(Privilege.Admin)
  offerorSignUp(@Body() offerorSignUpDto: OfferorSignUpDTO): Promise<void> {
    return this.authService.offerorSignUp(offerorSignUpDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
