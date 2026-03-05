import type { Cart, CartItem, AddCartItemPayload } from '../../entities/types';
import {
  getMockCart,
  addMockCartItem,
  updateMockCartItem,
  deleteMockCartItem,
  clearMockCart,
} from './mock-data';
import { useAuthStore } from '../../features/auth/store';

function getUserId(): number {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export async function getCart(): Promise<Cart> {
  return getMockCart(getUserId());
}

export async function addCartItem(payload: AddCartItemPayload): Promise<CartItem> {
  return addMockCartItem(getUserId(), payload);
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  return updateMockCartItem(getUserId(), itemId, quantity);
}

export async function deleteCartItem(itemId: number): Promise<void> {
  deleteMockCartItem(getUserId(), itemId);
}

export async function clearCart(): Promise<void> {
  clearMockCart(getUserId());
}
