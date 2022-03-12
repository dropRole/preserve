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
import { Complaint } from './complaint.entity';
import { ComplaintsService } from './complaints.service';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  @Roles(Privilege.Offeror, Privilege.Offeree)
  complain(@Body() submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    return this.complaintsService.complain(submitComplaintDTO);
  }

  @Get('/:idReservations')
  @Roles(Privilege.Admin, Privilege.Offeror)
  getComplaints(@Param() idReservations: string): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(idReservations);
  }

  @Patch()
  @Roles(Privilege.Offeror, Privilege.Offeree)
  reComplain(
    @Body() reSubmitComplaintDTO: ReSubmitComplaintDTO,
  ): Promise<void> {
    return this.complaintsService.reComplain(reSubmitComplaintDTO);
  }

  @Delete()
  @Roles(Privilege.Offeror, Privilege.Offeree)
  withDrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(idComplaints);
  }
}
