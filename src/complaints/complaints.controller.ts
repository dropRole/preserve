import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Account } from 'src/auth/account.entity';
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

  @Get('/:id_reservations')
  getComplaints(@Param() id_reservation: string): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(id_reservation);
  }

  @Get('/counter/:countered_to')
  getCounterComplaints(
    @Param('countered_to') countered_to: string,
  ): Promise<Complaint[]> {
    return this.complaintsService.getCounterComplaints(countered_to);
  }

  @Patch()
  reComplain(@Body() complainDTO: ComplainDTO): Promise<void> {
    return this.complaintsService.reComplain(complainDTO);
  }

  @Delete()
  withDrawComplaint(@Param() id_complaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(id_complaints);
  }
}
