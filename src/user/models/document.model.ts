import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
