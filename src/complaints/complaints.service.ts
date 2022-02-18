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

  getComplaints(idReservations: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectComplaints(idReservations);
  }

  getCounterComplaints(counteredTo: string): Promise<Complaint[]> {
    return this.complaintsRepository.selectCounterComplaints(counteredTo);
  }

  reComplain(complainDTO: ComplainDTO): Promise<void> {
    return this.complaintsRepository.updateComplaint(complainDTO);
  }

  withDrawComplaint(idComplaints: string): Promise<void> {
    return this.complaintsRepository.deleteComplaint(idComplaints);
  }
}
