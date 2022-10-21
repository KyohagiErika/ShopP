import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer";
import { Order } from "./order";
import { Product } from "./product";
import { Shop } from "./shop";

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    additionalInfo: string;

    @ManyToOne(() => Product, product => product.id)
    product: Product;

    @ManyToOne(() => Order, orderNumber => orderNumber.id)
    orderNumber: Order;

}