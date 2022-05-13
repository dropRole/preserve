import { Controller, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Privileges } from 'src/auth/privilege.decorator';
import { PrivilegesGuard } from 'src/auth/privileges.guard';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';
import { OffereesService } from './offerees.service';

@Controller('offerees')
@UseGuards(AuthGuard(), PrivilegesGuard)
export class OffereesController {
  constructor(private offereesService: OffereesService) {}

  @Get('/:idOfferees')
  @Privileges(Privilege.Admin, Privilege.Offeror)
  getOffereeById(@Param('idOfferees') idOfferees: string): Promise<Offeree> {
    return this.offereesService.getOffereeById(idOfferees);
  }

  @Get('/username/:username')
  @Privileges(Privilege.Admin)
  getOffereeByUsername(@Param('username') username: string): Promise<Offeree> {
    return this.offereesService.getOffereeByUsername(username);
  }

  @Patch('/:idOfferees/email')
  @Privileges(Privilege.Offeree)
  updateOffereeEmail(
    @GetAccount() account: Account,
    @Body('email') updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    return this.offereesService.updateOffereeEmail(
      account,
      updateOffereeEmailDTO,
    );
  }
}
