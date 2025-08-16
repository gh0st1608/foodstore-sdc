import { Order } from '../order.entity';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<void>;
}

export const OrderRepositorySymbol = Symbol('OrderRepository');