import type { Cart, CartItem, AddCartItemPayload } from '../../entities/types';
import {
  getMockCart,
  addMockCartItem,
  updateMockCartItem,
  deleteMockCartItem,
  clearMockCart,
} from './mock-data';

export async function getCart(): Promise<Cart> {
  return getMockCart();
}

export async function addCartItem(payload: AddCartItemPayload): Promise<CartItem> {
  return addMockCartItem(payload);
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  return updateMockCartItem(itemId, quantity);
}

export async function deleteCartItem(itemId: number): Promise<void> {
  deleteMockCartItem(itemId);
}

export async function clearCart(): Promise<void> {
  clearMockCart();
}
