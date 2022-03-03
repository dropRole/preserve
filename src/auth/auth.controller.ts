import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OffereeAuthCredentialsDTO } from './dto/offeree-auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('/signup')
  async offereeSignUp(
    @Body() offereeAuthCredentialsDTO: OffereeAuthCredentialsDTO,
  ): Promise<void> {
    this.authService.offereeSignUp(offereeAuthCredentialsDTO);
  }

  @Post('/signin')
  offereeSignIn(
    @Body() offereeAuthCredentialsDTO: OffereeAuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.offereeSignIn(offereeAuthCredentialsDTO);
  }

  /* @Post('/offeror/signup')
  @Roles(Role.Admin)
  async offerorSignUp(
    @Body() offerorAuthCredentialsDTO: OfferorAuthCredentialsDTO)
  ): Promise<void>{

  } */
}
