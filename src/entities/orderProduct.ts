import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    price: number;

    @Column()
    additionalInfo: string;

    @ManyToOne(() => Order, orderNumber => orderNumber.id)
    orderNumber: Order;

    @Column()
    quantity: number;

    @ManyToOne(() => Product, product => product.id)
    product: Product;

}