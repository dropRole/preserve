import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../auth/account.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { Complaint } from './complaint.entity';
import { ComplaintsRepository } from './complaints.repository';
import { ReSubmitComplaintDTO } from './dto/re-submit-complaint.dto';
import { SubmitComplaintDTO } from './dto/submit-complaint';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(ComplaintsRepository)
    private complaintsRepository: ComplaintsRepository,
    private reservationsService: ReservationsService,
  ) {}
  async complain(
    account: Account,
    submitComplaintDTO: SubmitComplaintDTO,
  ): Promise<void> {
    const { idReservations, counteredComplaint, content } = submitComplaintDTO;
    const reservation = await this.reservationsService.getReservation(
      account,
      idReservations,
    );
    const complaint = await this.complaintsRepository.findOne({
      idComplaints: counteredComplaint,
    });
    return this.complaintsRepository.insertComplaint(
      reservation,
      complaint,
      content,
      account,
    );
  }

  async getComplaints(
    account: Account,
    idReservations: string,
  ): Promise<Complaint[]> {
    const reservation = await this.reservationsService.getReservation(
      account,
      idReservations,
    );
    return this.complaintsRepository.selectComplaints(reservation, account);
  }

  async reComplain(
    account: Account,
    reSubmitComplaintDTO: ReSubmitComplaintDTO,
  ): Promise<void> {
    const { idComplaints, content } = reSubmitComplaintDTO;
    const complaint = await this.complaintsRepository.findOne({ idComplaints });
    // if account doesn't belong to the author
    if (complaint.account.username != account.username)
      throw new UnauthorizedException(
        "You're not the author of the complaint.",
      );
    // if complaint doesn't exist
    if (!complaint)
      throw new NotFoundException('Subject complaint was not found.');
    return this.complaintsRepository.updateComplaint(idComplaints, content);
  }

  async withdrawComplaint(
    account: Account,
    idComplaints: string,
  ): Promise<void> {
    const complaint = await this.complaintsRepository.findOne({ idComplaints });
    // if complaint doesn't exist
    if (!complaint)
      throw new NotFoundException('Subject complaint was not found');
    // if unathorized deletion attemp
    if (complaint.account.username !== account.username)
      throw new UnauthorizedException(
        'Unauthorized complaint deletion attempt. ',
      );
    return this.complaintsRepository.deleteComplaint(idComplaints);
  }
}
