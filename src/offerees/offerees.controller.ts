import { Controller, Body, Get, Param, Patch } from '@nestjs/common';
import { UpdateOffereeEmailDTO } from './dto/update-offeree-email.dto';
import { UpdateOffereeUsernameDTO } from './dto/update-offeree-username.dto';
import { Offeree } from './offeree.entity';
import { OffereesService } from './offerees.service';

@Controller('offerees')
export class OffereesController {
  constructor(private offereesService: OffereesService) {}
  @Get('/:id_offerees')
  getOfferee(@Param() id_offerees: string): Promise<Offeree> {
    return this.offereesService.getOfferee(id_offerees);
  }
  @Get(':/username')
  getOffereeByUsername(@Param('username') username: string): Promise<Offeree> {
    return this.offereesService.getOffereeByUsername(username);
  }
  @Patch('/:id_offerees/username')
  updateOffereeUsername(
    @Body('username') updateOffereeUsernameDTO: UpdateOffereeUsernameDTO,
  ): Promise<void> {
    return this.offereesService.updateOffereeUsername(updateOffereeUsernameDTO);
  }
  @Patch('/:id_offerees/email')
  updateOffereeEmail(
    @Param('id_offerees') id_offerees: string,
    @Body('email') updateOffereeEmailDTO: UpdateOffereeEmailDTO,
  ): Promise<void> {
    return this.offereesService.updateOffereeEmail(
      id_offerees,
      updateOffereeEmailDTO,
    );
  }
}
