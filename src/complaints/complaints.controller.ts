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
import { Account } from '../auth/account.entity';
import { Privilege } from '../auth/enum/privilege.enum';
import { GetAccount } from '../auth/get-account.decorator';
import { Privileges } from '../auth/privilege.decorator';
import { PrivilegesGuard } from '../auth/privileges.guard';
import { Complaint } from './complaint.entity';
import { ComplaintsService } from './complaints.service';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Controller('complaints')
@UseGuards(AuthGuard(), PrivilegesGuard)
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  complain(
    @Body() submitComplaintDTO: SubmitComplaintDTO,
    @GetAccount() account: Account,
  ): Promise<void> {
    return this.complaintsService.complain(account, submitComplaintDTO);
  }

  @Get('/:idReservations')
  @Privileges(Privilege.Admin, Privilege.Offeror, Privilege.Offeree)
  getComplaints(
    @GetAccount() account: Account,
    @Param('idReservations') idReservations: string,
  ): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(account, idReservations);
  }

  @Patch()
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  reComplain(
    @Body() reSubmitComplaintDTO: ReSubmitComplaintDTO,
    @GetAccount() account: Account,
  ): Promise<void> {
    return this.complaintsService.reComplain(account, reSubmitComplaintDTO);
  }

  @Delete('/:idComplaints')
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  withdrawComplaint(
    @GetAccount() account: Account,
    @Param('idComplaints') idComplaints: string,
  ): Promise<void> {
    return this.complaintsService.withdrawComplaint(account, idComplaints);
  }
}
