import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { GetAccount } from '../auth/get-account.decorator';
import { Privileges } from '../auth/privilege.decorator';
import { PrivilegesGuard } from '../auth/privileges.guard';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
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

  @Get('/:username')
  @Privileges(Privilege.Admin)
  getOfferorByUsername(@Param('username') username: string): Promise<Offeror> {
    return this.offerorsService.getOfferorByUsername(username);
  }

  @Patch('/:idOfferors/email')
  @Privileges(Privilege.Offeror)
  updateOfferorEmail(
    @GetAccount() account: Account,
    @Body('username') updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorEmail(
      account,
      updateOfferorEmailDTO,
    );
  }

  @Patch('/:idOfferors/businessInformation')
  @Privileges(Privilege.Offeror)
  updateOfferorBussinessInfo(
    @GetAccount() account: Account,
    @Body('username')
    updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorBusinessInfo(
      account,
      updateOfferorBusinessInfoDTO,
    );
  }
}
