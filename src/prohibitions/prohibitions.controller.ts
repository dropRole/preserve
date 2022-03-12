import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { Roles } from 'src/auth/privilege.decorator';
import { ProhibitOffereeDTO } from './dto/prohibit-offeree.dto';
import { UpdateProhibitionTimeframeDTO } from './dto/update-prohibition-timeframe.dto';
import { Prohibition } from './prohibitions.entity';
import { ProhibitionsService } from './prohibitions.service';

@Controller('prohibitions')
export class ProhibitionsController {
  constructor(private prohibitonsService: ProhibitionsService) {}

  @Post()
  @Roles(Privilege.Admin)
  prohibitAnOfferee(prohibitOffereeDTO: ProhibitOffereeDTO): Promise<void> {
    return this.prohibitonsService.prohibitAnOfferee(prohibitOffereeDTO);
  }

  @Get('/:idOfferors')
  @Roles(Privilege.Admin, Privilege.Offeror)
  getProhibitions(
    @Param('idOfferors') idOfferors: string,
  ): Promise<Prohibition[]> {
    return this.prohibitonsService.getProhibitions(idOfferors);
  }

  @Get('/:idProhibitions')
  @Roles(Privilege.Admin, Privilege.Offeror)
  getProhibition(
    @Param('idProhibitions') idProhibitions: string,
  ): Promise<Prohibition> {
    return this.prohibitonsService.getProhibition(idProhibitions);
  }

  @Patch('/:idProhibitons')
  @Roles(Privilege.Admin)
  updateProhibitionTimeframe(
    @Param('idProhibitons') idProhibitons: string,
    @Body() updateProhibitonTimeframeDTO: UpdateProhibitionTimeframeDTO,
  ): Promise<void> {
    return this.prohibitonsService.updateProhibitionTimeframe(
      idProhibitons,
      updateProhibitonTimeframeDTO,
    );
  }

  @Delete(':idProhibitions')
  @Roles(Privilege.Admin)
  deleteProhibition(idProhibitions: string): Promise<void> {
    return this.prohibitonsService.deleteProhibition(idProhibitions);
  }
}
