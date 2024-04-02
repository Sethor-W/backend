import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserBusiness {
  @PrimaryColumn()
  id: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  rut: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  key_word: string;

  @Column()
  credential: string;

  //   @Column({
  //     nullable: true,
  //     type: 'numeric',
  //     precision: 4,
  //   })
  //   pin: number;
}
