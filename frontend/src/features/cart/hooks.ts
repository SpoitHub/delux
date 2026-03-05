import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCart, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../../shared/api/cart';
import type { AddCartItemPayload } from '../../entities/types';
import { useCartStore } from './store';
import { useAuthStore } from '../auth/store';

export function useCart() {
  const setItemsCount = useCartStore((s) => s.setItemsCount);

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await getCart();
      setItemsCount(cart.items_count);
      return cart;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: (payload: AddCartItemPayload) => addCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Обёртка: если не авторизован — редирект на /login
  const mutate: typeof mutation.mutate = (payload, options) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    mutation.mutate(payload, options);
  };

  const mutateAsync: typeof mutation.mutateAsync = (payload, options) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return Promise.reject(new Error('Unauthenticated'));
    }
    return mutation.mutateAsync(payload, options);
  };

  return { ...mutation, mutate, mutateAsync };
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => deleteCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
