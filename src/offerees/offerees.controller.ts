import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Offeree } from './offeree.entity';
import { OffereesService } from './offerees.service';

@Controller('offerees')
export class OffereesController {
  constructor(private offereesService: OffereesService) {}
  @Get('/:id_offerees')
  getOfferee(@Param() id_offerees: string): Promise<Offeree> {
    return this.offereesService.getOfferee(id_offerees);
  }
  @Get()
  getOffereeByUsername(@Query('username') username: string): Promise<Offeree> {
    return this.offereesService.getOffereeByUsername(username);
  }
}
