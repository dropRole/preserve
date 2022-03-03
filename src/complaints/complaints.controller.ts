import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { Complaint } from './complaint.entity';
import { ComplaintsService } from './complaints.service';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  @Roles(Role.Offeror, Role.Offeree)
  complain(@Body() submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    return this.complaintsService.complain(submitComplaintDTO);
  }

  @Get('/:idReservations')
  @Roles(Role.Admin, Role.Offeror)
  getComplaints(@Param() idReservations: string): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(idReservations);
  }

  @Get('/counter/:counteredTo')
  @Roles(Role.Admin, Role.Offeror, Role.Offeree)
  getCounterComplaints(
    @Param('counteredTo') counteredTo: string,
  ): Promise<Complaint[]> {
    return this.complaintsService.getCounterComplaints(counteredTo);
  }

  @Patch()
  @Roles(Role.Offeror, Role.Offeree)
  reComplain(
    @Body() reSubmitComplaintDTO: ReSubmitComplaintDTO,
  ): Promise<void> {
    return this.complaintsService.reComplain(reSubmitComplaintDTO);
  }

  @Delete()
  @Roles(Role.Offeror, Role.Offeree)
  withDrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(idComplaints);
  }
}
