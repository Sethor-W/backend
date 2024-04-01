import { UserBusiness } from 'src/user/models/userBusiness.model';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class Company {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  description: string;

  @ManyToOne(() => UserBusiness, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserBusiness;
}
