export interface OrderPublisher {
  publishOrderCreated(payload: any): Promise<void>;
}

export const OrderPublisherSymbol = Symbol('OrderPublisher');
