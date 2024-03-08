import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  rutFrontalPhoto: string;

  @Column()
  rutDorsalPhoto: string;

  @Column()
  selfie: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
