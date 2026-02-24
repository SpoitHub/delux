import type { Order, CreateOrderPayload } from '../../entities/types';
import { createMockOrder, getMockOrder } from './mock-data';

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return createMockOrder(payload);
}

export async function getOrder(id: number | string): Promise<Order> {
  const order = getMockOrder(id);
  if (!order) throw new Error('Order not found');
  return order;
}
