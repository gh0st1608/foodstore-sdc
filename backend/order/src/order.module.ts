import { Module } from '@nestjs/common';
import { OrdersHttpController } from './infrastructure/order.http.controller';
import { CreateOrderUseCase } from './application/create-order.application';
import { GetOrderUseCase } from './application/get-order.application';
import { OrderPublisherSymbol } from './domain/service/event.service';
import { OrderRepositoryImpl } from './infrastructure/repository/order.repository';
import { OrderRepositorySymbol } from './domain/repository/order.repository';
import { SnsOrderPublisher } from './infrastructure/events/sns.order.publisher';

@Module({
  imports: [],
  controllers: [OrdersHttpController],
  providers: [
    CreateOrderUseCase,
    GetOrderUseCase,
    { provide: OrderRepositorySymbol, useClass: OrderRepositoryImpl },
    { provide: OrderPublisherSymbol, useClass: SnsOrderPublisher },
  ],
  exports: [],
})
export class OrdersModule {}