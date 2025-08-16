import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderUseCase } from '../application/create-order.application';
import { GetOrderUseCase } from '../application/get-order.application';
import { CreateOrderDTO } from '../application/dto/create-order.dto';

@Controller('orders')
export class OrdersHttpController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDTO) {
    try {
      const res = await this.createOrder.execute(dto);
      return { status: 'ok', ...res };
    } catch (err) {
      throw new HttpException(err.message || 'Internal', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const order = await this.getOrder.execute(id);
    if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    return order;
  }
}