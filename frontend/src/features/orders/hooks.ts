import { useQuery, useMutation } from '@tanstack/react-query';
import { createOrder, getOrder, getOrders } from '../../shared/api/orders';
import type { CreateOrderPayload } from '../../entities/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
  });
}

export function useOrder(id: number | string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
  });
}
