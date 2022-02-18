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
import { ComplainDTO } from './dto/complain.dto';

@Controller('complaint')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}
  @Post()
  complain(@Body() complainDTO: ComplainDTO): Promise<void> {
    return this.complaintsService.complain(complainDTO);
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
  reComplain(@Body() complainDTO: ComplainDTO): Promise<void> {
    return this.complaintsService.reComplain(complainDTO);
  }

  @Delete()
  withDrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(idComplaints);
  }
}
