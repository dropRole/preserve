import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  complain(submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    return this.complaintsRepository.insertComplaint(submitComplaintDTO);
  }

  getComplaints(idReservations: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectComplaints(idReservations);
  }

  getCounterComplaints(counteredTo: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectCounterComplaints(counteredTo);
  }

  async reComplain(reSubmitComplaintDTO: ReSubmitComplaintDTO): Promise<void> {
    const { idComplaints } = reSubmitComplaintDTO;
    const complaint = await this.complaintsRepository.findOne(idComplaints);
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
