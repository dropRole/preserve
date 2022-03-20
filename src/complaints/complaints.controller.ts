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
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
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
  complain(
    @Body() submitComplaintDTO: SubmitComplaintDTO,
    @GetAccount() account: Account,
  ): Promise<void> {
    return this.complaintsService.complain(submitComplaintDTO, account);
  }

  @Get('/:idReservations')
  @Roles(Privilege.Admin, Privilege.Offeror, Privilege.Offeree)
  getComplaints(
    @Param() idReservations: string,
    @GetAccount() account: Account,
  ): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(idReservations, account);
  }

  @Patch()
  @Roles(Privilege.Offeror, Privilege.Offeree)
  reComplain(
    @Body() reSubmitComplaintDTO: ReSubmitComplaintDTO,
    @GetAccount() account: Account,
  ): Promise<void> {
    return this.complaintsService.reComplain(reSubmitComplaintDTO, account);
  }

  @Delete()
  @Roles(Privilege.Offeror, Privilege.Offeree)
  withdrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withDrawComplaint(idComplaints);
  }
}
