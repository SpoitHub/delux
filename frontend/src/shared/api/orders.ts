import type { Order, CreateOrderPayload } from '../../entities/types';
import { apiRequest, getAuthToken } from './client';

export async function getOrders(): Promise<Order[]> {
  return apiRequest<Order[]>('/orders/', {}, getAuthToken());
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return apiRequest<Order>(
    '/orders/',
    { method: 'POST', body: JSON.stringify(payload) },
    getAuthToken()
  );
}

export async function getOrder(id: number | string): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}/`, {}, getAuthToken());
}
