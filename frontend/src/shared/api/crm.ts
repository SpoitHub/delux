import type { Event, Product, Order } from '../../entities/types';
import {
  MOCK_PRODUCTS,
  SEEDED_ORDERS,
  getMockProduct,
  getMockOrder,
} from './mock-data';
import { apiRequest, getAuthToken } from './client';
import { useAuthStore } from '../../features/auth/store';

function getCrmUserId(): number {
  return useAuthStore.getState().user?.id ?? 0;
}

function findAnyOrder(id: number | string): Order | undefined {
  return getMockOrder(getCrmUserId(), id)
    ?? SEEDED_ORDERS.find((o) => o.id === Number(id));
}

// ── Dashboard ──

export interface DashboardStats {
  events_count: number;
  orders_count: number;
  revenue: number;
  customers_count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Will be replaced when crm_app is implemented
  return {
    events_count: 0,
    orders_count: SEEDED_ORDERS.length,
    revenue: SEEDED_ORDERS.reduce((sum, o) => sum + o.total, 0),
    customers_count: 8,
  };
}

// ── CRM Events ──

export interface CrmEventPayload {
  title?: string;
  description?: string;
  format?: 'online' | 'offline';
  start_datetime?: string;
  end_datetime?: string;
  is_free?: boolean;
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
  location?: { city: string; address: string } | null;
  online_info?: { url: string; platform?: string } | null;
  ticket_types?: Array<{ id?: number; name: string; price: number; quantity_total: number }>;
  image?: File | null;
}

export async function getCrmEvents(): Promise<Event[]> {
  return apiRequest<Event[]>('/crm/events/', {}, getAuthToken());
}

export async function getCrmEvent(id: number | string): Promise<Event> {
  return apiRequest<Event>(`/crm/events/${id}/`, {}, getAuthToken());
}

export async function createCrmEvent(data: CrmEventPayload): Promise<Event> {
  const { image, ...rest } = data;

  // Always use FormData so we can optionally attach an image
  const form = new FormData();
  const { location, online_info, ticket_types, ...scalars } = rest;

  // Scalar fields
  for (const [key, val] of Object.entries(scalars)) {
    if (val !== undefined && val !== null) form.append(key, String(val));
  }

  // Nested objects as JSON strings (backend parses them in to_internal_value)
  if (location !== undefined) form.append('location', JSON.stringify(location));
  if (online_info !== undefined) form.append('online_info', JSON.stringify(online_info));
  if (ticket_types !== undefined) form.append('ticket_types', JSON.stringify(ticket_types));

  // Image file
  if (image) form.append('image', image);

  return apiRequest<Event>('/crm/events/', { method: 'POST', body: form }, getAuthToken());
}

export async function updateCrmEvent(id: number | string, data: CrmEventPayload): Promise<Event> {
  return apiRequest<Event>(`/crm/events/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, getAuthToken());
}

export async function deleteCrmEvent(id: number | string): Promise<void> {
  await apiRequest<void>(`/crm/events/${id}/`, { method: 'DELETE' }, getAuthToken());
}

export async function publishCrmEvent(id: number | string): Promise<Event> {
  await apiRequest<{ status: string }>(`/crm/events/${id}/publish/`, {
    method: 'POST',
  }, getAuthToken());
  return getCrmEvent(id);
}

export async function unpublishCrmEvent(id: number | string): Promise<Event> {
  await apiRequest<{ status: string }>(`/crm/events/${id}/unpublish/`, {
    method: 'POST',
  }, getAuthToken());
  return getCrmEvent(id);
}


// ── CRM Products ──

export async function getCrmProducts(): Promise<Product[]> {
  return [...MOCK_PRODUCTS];
}

export async function getCrmProduct(id: number | string): Promise<Product> {
  const product = getMockProduct(id);
  if (!product) throw new Error('Product not found');
  return product;
}

export async function createCrmProduct(data: Partial<Product>): Promise<Product> {
  return {
    id: Math.floor(Math.random() * 9000) + 1000,
    title: data.title ?? 'New Product',
    description: data.description ?? '',
    price: data.price ?? 0,
    category: data.category,
    stock_quantity: data.stock_quantity ?? 0,
    is_active: data.is_active ?? true,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateCrmProduct(id: number | string, data: Partial<Product>): Promise<Product> {
  const product = getMockProduct(id);
  if (!product) throw new Error('Product not found');
  return { ...product, ...data, updated_at: new Date().toISOString() };
}

// ── CRM Orders ──

export interface CrmOrderFilters {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}

export async function getCrmOrders(filters?: CrmOrderFilters): Promise<Order[]> {
  let orders = [...SEEDED_ORDERS];

  if (filters?.status) {
    orders = orders.filter((o) => o.status === filters.status);
  }
  if (filters?.payment_status) {
    orders = orders.filter((o) => o.payment_status === filters.payment_status);
  }

  return orders;
}

export async function getCrmOrder(id: number | string): Promise<Order> {
  const order = findAnyOrder(id);
  if (!order) throw new Error('Order not found');
  return order;
}

export async function updateCrmOrderStatus(
  id: number | string,
  status: Order['status'],
): Promise<Order> {
  const order = findAnyOrder(id);
  if (!order) throw new Error('Order not found');
  return { ...order, status, updated_at: new Date().toISOString() };
}

// ── CRM Customers ──

export interface CrmCustomer {
  id: number;
  name: string;
  email: string;
  orders: number;
  total_spent: number;
  joined: string;
  last_order: string;
  notes: string[];
}

const MOCK_CUSTOMERS: CrmCustomer[] = [
  { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', orders: 12, total_spent: 342000, joined: 'Jan 2024', last_order: 'Feb 20, 2026', notes: [] },
  { id: 2, name: 'Sarah Smith', email: 'sarah.s@example.com', orders: 8, total_spent: 215000, joined: 'Feb 2024', last_order: 'Feb 18, 2026', notes: [] },
  { id: 3, name: 'Mike Brown', email: 'mike.b@example.com', orders: 5, total_spent: 98000, joined: 'Mar 2024', last_order: 'Feb 15, 2026', notes: [] },
  { id: 4, name: 'Emma Davis', email: 'emma.d@example.com', orders: 15, total_spent: 560000, joined: 'Jan 2024', last_order: 'Feb 22, 2026', notes: [] },
  { id: 5, name: 'James Wilson', email: 'james.w@example.com', orders: 3, total_spent: 45000, joined: 'May 2024', last_order: 'Feb 10, 2026', notes: [] },
  { id: 6, name: 'Olivia Martinez', email: 'olivia.m@example.com', orders: 9, total_spent: 287000, joined: 'Feb 2024', last_order: 'Feb 19, 2026', notes: [] },
  { id: 7, name: 'William Garcia', email: 'william.g@example.com', orders: 1, total_spent: 12000, joined: 'Oct 2024', last_order: 'Feb 5, 2026', notes: [] },
  { id: 8, name: 'Sophia Lee', email: 'sophia.l@example.com', orders: 22, total_spent: 890000, joined: 'Dec 2023', last_order: 'Feb 25, 2026', notes: [] },
];

export async function getCrmCustomers(): Promise<CrmCustomer[]> {
  return [...MOCK_CUSTOMERS];
}

export async function getCrmCustomer(userId: number | string): Promise<CrmCustomer> {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === Number(userId));
  if (!customer) throw new Error('Customer not found');
  return customer;
}

export async function addCustomerNote(userId: number | string, note: string): Promise<CrmCustomer> {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === Number(userId));
  if (!customer) throw new Error('Customer not found');
  customer.notes.push(note);
  return customer;
}
