import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('/signup')
  async offereeSignUp(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    this.authService.offereeSignUp(authCredentialsDTO);
  }

  @Post('/signin')
  offereeSignIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.offereeSignIn(authCredentialsDTO);
  }

  /* @Post('/offeror/signup')
  @Roles(Role.Admin)
  async offerorSignUp(
    @Body() offerorAuthCredentialsDTO: OfferorAuthCredentialsDTO)
  ): Promise<void>{

  } */
}
