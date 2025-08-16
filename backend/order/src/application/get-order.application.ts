import { Injectable, Inject } from '@nestjs/common';
import { OrderRepository, OrderRepositorySymbol } from '../domain/repository/order.repository';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(OrderRepositorySymbol)
    private readonly orderRepo: OrderRepository,
  ) {}

  async execute(orderId: string) {
    return await this.orderRepo.findById(orderId);
  }
}