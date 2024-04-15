import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TemporaryCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  active: boolean;

  @Column()
  minute: number;

  @Column()
  seconds: number;
}
