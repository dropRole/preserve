import { OffereeAuthCredentialsDTO } from 'src/auth/dto/offeree-auth-credentials.dto';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { Offeree } from './offeree.entity';

@EntityRepository(Offeree)
export class OffereesRepository extends Repository<Offeree> {
  async insertOfferee(
    offereeAuthCredentialsDTO: OffereeAuthCredentialsDTO,
  ): Promise<Offeree> {
    const { username, email } = offereeAuthCredentialsDTO;
    const offeree = this.create({ username, email });
    await this.save(offeree);
    return offeree;
  }
  async selectOfferee(id_offerees: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ id_offerees });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [id_offerees], 'postgres');
    }
  }
  async selectOffereeByUsername(username: string): Promise<Offeree> {
    const query = this.createQueryBuilder('offerees');
    query.where({ username });
    try {
      // if select query failed to execute
      return await query.getOne();
    } catch (error) {
      throw new QueryFailedError(query.getSql(), [username], 'postgres');
    }
  }
}
