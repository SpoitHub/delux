import type { Order, CreateOrderPayload } from '../../entities/types';
import { createMockOrder, getMockOrder, getMockOrders } from './mock-data';
import { useAuthStore } from '../../features/auth/store';

function getUserId(): number {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function getOrders(): Promise<Order[]> {
  return getMockOrders(getUserId());
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return createMockOrder(getUserId(), payload);
}

export async function getOrder(id: number | string): Promise<Order> {
  const order = getMockOrder(getUserId(), id);
  if (!order) throw new Error('Order not found');
  return order;
}
