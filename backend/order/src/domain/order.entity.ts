export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';

// FILE: src/domain/entities/order.entity.ts
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // price at order time
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public total: number,
    public status: OrderStatus = 'PENDING',
    public readonly createdAt: string = new Date().toISOString(),
    public updatedAt?: string,
  ) {}

  calculateTotal() {
    this.total = this.items.reduce((s, it) => s + it.price * it.quantity, 0);
  }

  confirm() {
    this.status = 'CONFIRMED';
    this.updatedAt = new Date().toISOString();
  }

  cancel() {
    this.status = 'CANCELLED';
    this.updatedAt = new Date().toISOString();
  }
}