import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardStats,
  getCrmEvents,
  getCrmEvent,
  createCrmEvent,
  updateCrmEvent,
  publishCrmEvent,
  unpublishCrmEvent,
  getCrmProducts,
  getCrmProduct,
  createCrmProduct,
  updateCrmProduct,
  getCrmOrders,
  getCrmOrder,
  updateCrmOrderStatus,
  getCrmCustomers,
  getCrmCustomer,
  addCustomerNote,
  type CrmOrderFilters,
} from '../../shared/api/crm';
import type { Event, Product, Order } from '../../entities/types';

// ── Dashboard ──

export function useDashboard() {
  return useQuery({
    queryKey: ['crm', 'dashboard'],
    queryFn: getDashboardStats,
  });
}

// ── CRM Events ──

export function useCrmEvents() {
  return useQuery({
    queryKey: ['crm', 'events'],
    queryFn: getCrmEvents,
  });
}

export function useCrmEvent(id: number | string) {
  return useQuery({
    queryKey: ['crm', 'events', id],
    queryFn: () => getCrmEvent(id),
    enabled: !!id,
  });
}

export function useCreateCrmEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => createCrmEvent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'events'] }),
  });
}

export function useUpdateCrmEvent(id: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => updateCrmEvent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm', 'events'] });
      qc.invalidateQueries({ queryKey: ['crm', 'events', id] });
    },
  });
}

export function usePublishCrmEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => publishCrmEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'events'] }),
  });
}

export function useUnpublishCrmEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => unpublishCrmEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'events'] }),
  });
}

// ── CRM Products ──

export function useCrmProducts() {
  return useQuery({
    queryKey: ['crm', 'products'],
    queryFn: getCrmProducts,
  });
}

export function useCrmProduct(id: number | string) {
  return useQuery({
    queryKey: ['crm', 'products', id],
    queryFn: () => getCrmProduct(id),
    enabled: !!id,
  });
}

export function useCreateCrmProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => createCrmProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm', 'products'] }),
  });
}

export function useUpdateCrmProduct(id: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => updateCrmProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm', 'products'] });
      qc.invalidateQueries({ queryKey: ['crm', 'products', id] });
    },
  });
}

// ── CRM Orders ──

export function useCrmOrders(filters?: CrmOrderFilters) {
  return useQuery({
    queryKey: ['crm', 'orders', filters],
    queryFn: () => getCrmOrders(filters),
  });
}

export function useCrmOrder(id: number | string) {
  return useQuery({
    queryKey: ['crm', 'orders', id],
    queryFn: () => getCrmOrder(id),
    enabled: !!id,
  });
}

export function useUpdateCrmOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: Order['status'] }) =>
      updateCrmOrderStatus(id, status),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['crm', 'orders'] });
      qc.invalidateQueries({ queryKey: ['crm', 'orders', id] });
    },
  });
}

// ── CRM Customers ──

export function useCrmCustomers() {
  return useQuery({
    queryKey: ['crm', 'customers'],
    queryFn: getCrmCustomers,
  });
}

export function useCrmCustomer(id: number | string) {
  return useQuery({
    queryKey: ['crm', 'customers', id],
    queryFn: () => getCrmCustomer(id),
    enabled: !!id,
  });
}

export function useAddCustomerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, note }: { userId: number | string; note: string }) =>
      addCustomerNote(userId, note),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['crm', 'customers', userId] });
    },
  });
}
