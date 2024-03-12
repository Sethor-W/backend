import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Company } from './company.model';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  opening_days: string;

  @Column()
  opening_time: string;

  @Column()
  closing_time: string;

  @ManyToOne(() => Company, (comp) => comp.id)
  company: string;
}
