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
import { Account } from 'src/auth/account.entity';
import { Privilege } from 'src/auth/enum/privilege.enum';
import { GetAccount } from 'src/auth/get-account.decorator';
import { Privileges } from 'src/auth/privilege.decorator';
import { PrivilegesGuard } from 'src/auth/privileges.guard';
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
    @Param() idReservations: string,
    @GetAccount() account: Account,
  ): Promise<Complaint[]> {
    return this.complaintsService.getComplaints(idReservations, account);
  }

  @Patch()
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  reComplain(
    @Body() reSubmitComplaintDTO: ReSubmitComplaintDTO,
    @GetAccount() account: Account,
  ): Promise<void> {
    return this.complaintsService.reComplain(reSubmitComplaintDTO, account);
  }

  @Delete()
  @Privileges(Privilege.Offeror, Privilege.Offeree)
  withdrawComplaint(@Param() idComplaints: string): Promise<void> {
    return this.complaintsService.withdrawComplaint(idComplaints);
  }
}
