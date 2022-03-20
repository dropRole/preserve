import { Controller, Body, Get, Param, Patch } from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Roles } from 'src/auth/privilege.decorator';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';
import { OffereesService } from './offerees.service';

@Controller('offerees')
export class OffereesController {
  constructor(private offereesService: OffereesService) {}

  @Get('/:idOfferees')
  @Roles(Privilege.Admin, Privilege.Offeror)
  getOfferee(@Param() idOfferees: string): Promise<Offeree> {
    return this.offereesService.getOfferee(idOfferees);
  }

  @Get(':/username')
  @Roles(Privilege.Admin)
  getOffereeByUsername(@Param('username') username: string): Promise<Offeree> {
    return this.offereesService.getOffereeByUsername(username);
  }

  @Patch('/:idOfferees/username')
  @Roles(Privilege.Offeree)
  updateOffereeUsername(
    @GetAccount() account: Account,
    @Body('username') updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    return this.offereesService.updateOffereeUsername(
      account,
      updateOffereeUsernameDTO,
    );
  }

  @Patch('/:idOfferees/email')
  @Roles(Privilege.Offeree)
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
