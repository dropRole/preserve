import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
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
    const reservation = await this.reservationsService.getReservationById(
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
    const reservation = await this.reservationsService.getReservationById(
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
    let complaint: Complaint;
    const query = this.complaintsRepository.createQueryBuilder('complaints');
    query.addSelect('author.username');
    query.innerJoin('complaints.account', 'author');
    query.where({ account: { username: account.username } });
    try {
      complaint = await query.getOne();
    } catch (error) {
      throw new QueryFailedError(
        query.getSql(),
        [account.username],
        error.message,
      );
    }
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
    let complaint: Complaint;

    const query = this.complaintsRepository.createQueryBuilder('complaints');

    query.addSelect('author.username');
    query.innerJoin('complaints.account', 'author');
    query.where({ account: { username: account.username } });

    try {
      complaint = await query.getOne();
    } catch (error) {
      throw new QueryFailedError(
        query.getSql(),
        [account.username],
        error.message,
      );
    }

    // if complaint doesn't exist
    if (!complaint)
      throw new NotFoundException('Subject complaint was not found');

    // if unathorized deletion attemp
    if (complaint.account.username !== account.username)
      throw new UnauthorizedException(
        'Unauthorized complaint deletion attempt. ',
      );

    // if any counter complaint
    if (await this.getCounterComplaints(idComplaints))
      throw new ConflictException(
        `There are counter complaints for the subject ${complaint.idComplaints} complaint.`,
      );

    return this.complaintsRepository.deleteComplaint(idComplaints);
  }

  private async getCounterComplaints(idComplaints: string): Promise<boolean> {
    const query = this.complaintsRepository.createQueryBuilder('complaints');

    query.where({ counteredComplaint: { idComplaints } });

    try {
      // if there is any counter complaint on the subject one
      if ((await query.getMany()).length > 0) return true;
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [idComplaints], error.message);
    }
    return false;
  }
}
