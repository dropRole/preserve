import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { Roles } from 'src/auth/privilege.decorator';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { UpdateOfferorUsernameDTO } from './dto/update-offeror-username.dto';
import { Offeror } from './offeror.entity';
import { OfferorsService } from './offerors.service';

@Controller('offerors')
export class OfferorsController {
  constructor(private offerorsService: OfferorsService) {}

  @Get('/:idOfferors')
  @Roles(Privilege.Admin, Privilege.Offeree)
  getOfferorById(@Param('idOfferors') idOfferors: string): Promise<Offeror> {
    return this.offerorsService.getOfferorById(idOfferors);
  }

  @Get('/:username')
  @Roles(Privilege.Admin)
  getOfferorByUsername(@Param('username') username: string): Promise<Offeror> {
    return this.offerorsService.getOfferorByUsername(username);
  }

  @Patch('/:idOfferors/username')
  @Roles(Privilege.Offeror)
  updateOfferorUsername(
    @Param() idOfferors: string,
    @Body('username') updateOfferorUsernameDTO: UpdateOfferorUsernameDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorUsername(
      idOfferors,
      updateOfferorUsernameDTO,
    );
  }

  @Patch('/:idOfferors/email')
  @Roles(Privilege.Offeror)
  updateOfferorEmail(
    @Param() idOfferors: string,
    @Body('username') updateOfferorEmailDTO: UpdateOfferorEmailDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorEmail(
      idOfferors,
      updateOfferorEmailDTO,
    );
  }

  @Patch('/:idOfferors/businessInformation')
  @Roles(Privilege.Offeror)
  updateOfferorBussinessInfo(
    @Param() idOfferors: string,
    @Body('username')
    updateOfferorBusinessInfoDTO: UpdateOfferorBusinessInfoDTO,
  ): Promise<void> {
    return this.offerorsService.updateOfferorBusinessInfo(
      idOfferors,
      updateOfferorBusinessInfoDTO,
    );
  }
}
