import type { Cart, CartItem, AddCartItemPayload } from '../../entities/types';
import { apiRequest, getAuthToken } from './client';

export async function getCart(): Promise<Cart> {
  return apiRequest<Cart>('/cart/', {}, getAuthToken());
}

export async function addCartItem(payload: AddCartItemPayload): Promise<CartItem> {
  return apiRequest<CartItem>(
    '/cart/items/',
    { method: 'POST', body: JSON.stringify(payload) },
    getAuthToken(),
  );
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  return apiRequest<CartItem>(
    `/cart/items/${itemId}/`,
    { method: 'PATCH', body: JSON.stringify({ quantity }) },
    getAuthToken(),
  );
}

export async function deleteCartItem(itemId: number): Promise<void> {
  await apiRequest<void>(`/cart/items/${itemId}/`, { method: 'DELETE' }, getAuthToken());
}

export async function clearCart(): Promise<void> {
  await apiRequest<void>('/cart/clear/', { method: 'POST' }, getAuthToken());
}
