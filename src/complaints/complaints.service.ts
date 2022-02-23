import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './complaint.entity';
import { ComplaintsRepository } from './complaints.repository';
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

  reComplain(submitComplaintDTO: SubmitComplaintDTO): Promise<void> {
    return this.complaintsRepository.updateComplaint(submitComplaintDTO);
  }

  withDrawComplaint(idComplaints: string): Promise<void> {
    return this.complaintsRepository.deleteComplaint(idComplaints);
  }
}
