import { useQuery, useMutation } from '@tanstack/react-query';
import { createOrder, getOrder } from '../../shared/api/orders';
import type { CreateOrderPayload } from '../../entities/types';

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
