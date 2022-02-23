import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Complaint } from './complaint.entity';
import { ComplaintsService } from './complaints.service';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Controller('complaint')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}
  @Post()
  complain(@Body() submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    return this.complaintsService.complain(submitComplaintDTO);
  }

  @Get('/:idReservations')
  getComplaints(@Param() idReservations: string): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(idReservations);
  }

  @Get('/counter/:counteredTo')
  getCounterComplaints(
    @Param('counteredTo') counteredTo: string,
  ): Promise<Complaint[]> {
    return this.complaintsService.getCounterComplaints(counteredTo);
  }

  @Patch()
  reComplain(@Body() submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    return this.complaintsService.reComplain(submitComplaintDTO);
  }

  @Delete()
  withDrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(idComplaints);
  }
}
