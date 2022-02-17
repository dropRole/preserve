import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './complaint.entity';
import { ComplaintsRepository } from './complaints.repository';
import { ComplainDTO } from './dto/complain.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(ComplaintsRepository)
    private complaintsRepository: ComplaintsRepository,
  ) {}
  complain(complainDTO: ComplainDTO): Promise<void> {
    return this.complaintsRepository.insertComplaint(complainDTO);
  }

  getComplaints(id_reservations: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectComplaints(id_reservations);
  }

  getCounterComplaints(countered_to: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectCounterComplaints(countered_to);
  }

  reComplain(complainDTO: ComplainDTO): Promise<void> {
    return this.complaintsRepository.updateComplaint(complainDTO);
  }

  withDrawComplaint(id_complaints: string): Promise<void> {
    return this.complaintsRepository.deleteComplaint(id_complaints);
  }
}
