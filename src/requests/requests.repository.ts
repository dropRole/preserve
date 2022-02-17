import { EntityRepository, Repository } from 'typeorm';
import { Request } from './request.entity';

@EntityRepository(Request)
export class RequestsRepository extends Repository<Request> {}
