import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity()
export class Document {
  @PrimaryColumn()
  id: string;

  @Column({
    nullable: false,
  })
  rutFrontalPhoto: string;

  @Column({
    nullable: false,
  })
  rutDorsalPhoto: string;

  @Column({
    nullable: false,
  })
  selfie: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
