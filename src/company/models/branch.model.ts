import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Company } from './company.model';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  address: string;

  @ManyToOne(() => Company, (comp) => comp.id)
  company: string;
}
