import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../domain/order.entity';
import { OrderRepository, OrderRepositorySymbol } from '../domain/repository/order.repository';
import { OrderPublisher, OrderPublisherSymbol } from '../domain/service/event.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(OrderRepositorySymbol)
    private readonly orderRepo: OrderRepository,
    @Inject(OrderPublisherSymbol)
    private readonly publisher: OrderPublisher,
  ) {}

  async execute(dto: CreateOrderDTO) {
    const id = uuidv4();
    const order = new Order(id, dto.userId, dto.items.map(i => ({ ...i })), 0);
    order.calculateTotal();

    // save order in DB
    await this.orderRepo.save(order);

    // publish domain event
    await this.publisher.publishOrderCreated({
      event: 'order.created',
      data: {
        orderId: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
      },
      metadata: { ts: new Date().toISOString() },
    });

    return { orderId: order.id };
  }
}