import { EntityRepository, Repository } from 'typeorm';
import { Offeror } from './offeror.entity';

@EntityRepository(Offeror)
export class OfferorsRepository extends Repository<Offeror> {}
