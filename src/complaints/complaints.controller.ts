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
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Controller('complaints')
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
  reComplain(
    @Body() reSubmitComplaintDTO: ReSubmitComplaintDTO,
  ): Promise<void> {
    return this.complaintsService.reComplain(reSubmitComplaintDTO);
  }

  @Delete()
  withDrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(idComplaints);
  }
}
