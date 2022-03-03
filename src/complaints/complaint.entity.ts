import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  idComplaints: string;

  @Column()
  idRequests: string;
  
  @Column()
  username: string;
  
  @Column()
  counteredTo: string;

  @Column()
  content: string;

  @Column()
  written: string;

  @Column()
  updated: string;
}
