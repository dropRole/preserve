import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Privilege } from '../auth/enum/privilege.enum';
import { Privileges } from '../auth/privilege.decorator';
import { PrivilegesGuard } from '../auth/privileges.guard';
import { ProhibitOffereeDTO } from './dto/prohibit-offeree.dto';
import { UpdateProhibitionTimeframeDTO } from './dto/update-prohibition-timeframe.dto';
import { Prohibition } from './prohibitions.entity';
import { ProhibitionsService } from './prohibitions.service';

@Controller('prohibitions')
@UseGuards(AuthGuard(), PrivilegesGuard)
export class ProhibitionsController {
  constructor(private prohibitonsService: ProhibitionsService) {}

  @Post()
  @Privileges(Privilege.Admin)
  prohibitAnOfferee(prohibitOffereeDTO: ProhibitOffereeDTO): Promise<void> {
    return this.prohibitonsService.prohibitAnOfferee(prohibitOffereeDTO);
  }

  @Get('/offeror/:idOfferors')
  @Privileges(Privilege.Admin, Privilege.Offeror)
  getProhibitions(
    @Param('idOfferors') idOfferors: string,
  ): Promise<Prohibition[]> {
    return this.prohibitonsService.getProhibitions(idOfferors);
  }

  @Get('/:idProhibitions')
  @Privileges(Privilege.Admin, Privilege.Offeror)
  getProhibition(@Param() idProhibitions: string): Promise<Prohibition> {
    return this.prohibitonsService.getProhibition(idProhibitions);
  }

  @Patch('/:idProhibitions')
  @Privileges(Privilege.Admin)
  updateProhibitionTimeframe(
    @Param('idProhibitions') idProhibitons: string,
    @Body() updateProhibitonTimeframeDTO: UpdateProhibitionTimeframeDTO,
  ): Promise<void> {
    return this.prohibitonsService.updateProhibitionTimeframe(
      idProhibitons,
      updateProhibitonTimeframeDTO,
    );
  }

  @Delete('/:idProhibitions')
  @Privileges(Privilege.Admin)
  deleteProhibition(
    @Param('idProhibitions') idProhibitions: string,
  ): Promise<void> {
    return this.prohibitonsService.deleteProhibition(idProhibitions);
  }
}
