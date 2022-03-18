import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/account.entity';
import { Complaint } from './complaint.entity';
import { ComplaintsRepository } from './complaints.repository';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(ComplaintsRepository)
    private complaintsRepository: ComplaintsRepository,
  ) {}
  complain(
    submitComplaintDTO: SubmitComplaintDTO,
    account: Account,
  ): Promise<void> {
    return this.complaintsRepository.insertComplaint(
      submitComplaintDTO,
      account,
    );
  }

  getComplaints(
    idReservations: string,
    account: Account,
  ): Promise<Complaint[]> {
    return this.complaintsRepository.selectComplaints(idReservations, account);
  }

  getCounterComplaints(counteredTo: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectCounterComplaints(counteredTo);
  }

  async reComplain(
    reSubmitComplaintDTO: ReSubmitComplaintDTO,
    account: Account,
  ): Promise<void> {
    const { idComplaints } = reSubmitComplaintDTO;
    const complaint = await this.complaintsRepository.findOne({ idComplaints });
    // if account doesn't belong to the author
    if (complaint.account != account)
      throw new UnauthorizedException(
        "You're not the author of the complaint.",
      );
    // if complaint doesn't exist
    if (!complaint)
      throw new NotFoundException('Subject complaint was not found.');
    return this.complaintsRepository.updateComplaint(reSubmitComplaintDTO);
  }

  async withDrawComplaint(idComplaints: string): Promise<void> {
    // if complaint doesn't exist
    if (!(await this.complaintsRepository.findOne(idComplaints)))
      throw new NotFoundException('Subject complant was not found');
    return this.complaintsRepository.deleteComplaint(idComplaints);
  }
}
