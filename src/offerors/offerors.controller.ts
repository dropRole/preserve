import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateOfferorBusinessInfoDTO } from './dto/update-offeror-business-info.dto';
import { UpdateOfferorEmailDTO } from './dto/update-offeror-email.dto';
import { UpdateOfferorUsernameDTO } from './dto/update-offeror-username.dto';
import { Offeror } from './offeror.entity';
import { OfferorsService } from './offerors.service';

@Controller('offerors')
export class OfferorsController {
  constructor(private offerorsService: OfferorsService) {}

  @Get('/:idOfferors')
  @Roles(Role.Admin, Role.Offeree)
  getOfferorById(@Param('idOfferors') idOfferors: string): Promise<Offeror> {
    return this.offerorsService.getOfferorById(idOfferors);
  }

  @Get('/:username')
  @Roles(Role.Admin)
  getOfferorByUsername(@Param('username') username: string): Promise<Offeror> {
    return this.offerorsService.getOfferorByUsername(username);
  }

  @Patch('/:idOfferors/username')
  @Roles(Role.Offeror)
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
  @Roles(Role.Offeror)
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
  @Roles(Role.Offeror)
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
