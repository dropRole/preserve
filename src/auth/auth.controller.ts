import { Body, Controller, Post, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { OfferorSignUpDTO } from './dto/offeror-signup.dto';
import { Privilege } from './enum/privilege.enum';
import { Privileges } from './privilege.decorator';
import { GetAccount } from './get-account.decorator';
import { Account } from './account.entity';
import { UpdateUsernameDTO } from './dto/update-username.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrivilegesGuard } from './privileges.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/offeree/signup')
  offereeSignUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.offereeSignUp(authCredentialsDTO);
  }

  @Post('/offeror/signup')
  @UseGuards(AuthGuard(), PrivilegesGuard)
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

  @Patch('/username')
  @UseGuards(AuthGuard(), PrivilegesGuard)
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  updateAccountUsername(
    @GetAccount() account: Account,
    @Body() updateUsernameDTO: UpdateUsernameDTO,
  ): Promise<void> {
    return this.authService.updateAccountUsername(account, updateUsernameDTO);
  }
}
