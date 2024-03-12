import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Company } from './company.model';

@Entity()
export class Branch {
  @PrimaryColumn()
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

  @ManyToOne(() => Company, (comp) => comp.id, { onDelete: 'CASCADE' })
  company: Company;
}
