import { Order } from '../../company/models/order';
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryColumn()
  id: string;

  @Column()
  businessName: string;

  @Column()
  businessType: string;

  @Column()
  branchAdress: string;

  @Column()
  typeBiometric: string;

  @Column()
  card: string;

  @Column()
  suplier: string;

  @Column()
  cardHolder: string;

  @OneToOne(() => Order, (order) => order.id)
  @JoinColumn()
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sth: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
