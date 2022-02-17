import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id_complaints: string;

  @Column()
  id_requests: string;
  
  @Column()
  username: string;
  
  @Column()
  countered_to: string;

  @Column()
  content: string;

  @Column()
  written: string;
}
