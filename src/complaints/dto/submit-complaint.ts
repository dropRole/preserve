import { IsNotEmpty, IsString } from 'class-validator';
import { Request } from '../../requests/request.entity';
import { Complaint } from '../complaint.entity';

export class SubmitComplaintDTO {
  request: Request;

  counteredComplaint: Complaint | undefined;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  written: string;
}
