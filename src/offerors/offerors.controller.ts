import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Privileges } from 'src/auth/privilege.decorator';
import { PrivilegesGuard } from 'src/auth/privileges.guard';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { UpdateOfferorUsernameDTO } from './dto/update-offeror-username.dto';
import { Offeror } from './offeror.entity';
import { OfferorsService } from './offerors.service';

@Controller('offerors')
@UseGuards(AuthGuard(), PrivilegesGuard)
export class OfferorsController {
  constructor(private offerorsService: OfferorsService) {}

  @Get('/:idOfferors')
  @Privileges(Privilege.Admin, Privilege.Offeree)
  getOfferorById(@Param('idOfferors') idOfferors: string): Promise<Offeror> {
    return this.offerorsService.getOfferorById(idOfferors);
  }

  @Get('/username/:username')
  @Privileges(Privilege.Admin)
  getOfferorByUsername(@Param('username') username: string): Promise<Offeror> {
    return this.offerorsService.getOfferorByUsername(username);
  }

  @Patch('/email')
  @Privileges(Privilege.Offeror)
  updateOfferorEmail(
    @GetAccount() account: Account,
    @Body() updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorEmail(
      account,
      updateOfferorEmailDTO,
    );
  }

  @Patch('/businessInfo')
  @Privileges(Privilege.Offeror)
  updateOfferorBussinessInfo(
    @GetAccount() account: Account,
    @Body() updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorBusinessInfo(
      account,
      updateOfferorBusinessInfoDTO,
    );
  }

}
