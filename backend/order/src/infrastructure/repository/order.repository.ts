import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Order } from '../../domain/order.entity';
import { OrderRepository } from '../../domain/repository/order.repository';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private readonly tableName = process.env.ORDERS_TABLE || 'OrdersTable';
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    const db = new DynamoDBClient({ region: process.env.REGION || 'us-east-1' });
    this.client = DynamoDBDocumentClient.from(db);
  }

  async save(order: Order): Promise<void> {
    const item = { ...order };
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  async findById(id: string): Promise<Order | null> {
    const resp = await this.client.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    if (!resp.Item) return null;
    const it = resp.Item as any;
    return new Order(it.id, it.userId, it.items, it.total, it.status, it.createdAt, it.updatedAt);
  }

  async update(order: Order): Promise<void> {
    // For simplicity use put
    await this.save(order);
  }
}