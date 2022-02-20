import { Controller, Body, Get, Param, Patch } from '@nestjs/common';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';
import { OffereesService } from './offerees.service';

@Controller('offerees')
export class OffereesController {
  constructor(private offereesService: OffereesService) {}
  @Get('/:idOfferees')
  getOfferee(@Param() idOfferees: string): Promise<Offeree> {
    return this.offereesService.getOfferee(idOfferees);
  }
  @Get(':/username')
  getOffereeByUsername(@Param('username') username: string): Promise<Offeree> {
    return this.offereesService.getOffereeByUsername(username);
  }
  @Patch('/:idOfferees/username')
  updateOffereeUsername(
    @Param('idOfferees') idOfferees: string,
    @Body('username') updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    return this.offereesService.updateOffereeUsername(
      idOfferees,
      updateOffereeUsernameDTO,
    );
  }
  @Patch('/:idOfferees/email')
  updateOffereeEmail(
    @Param('idOfferees') idOfferees: string,
    @Body('email') updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    return this.offereesService.updateOffereeEmail(
      idOfferees,
      updateOffereeEmailDTO,
    );
  }
}
