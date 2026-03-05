import type { Event, Product, Order } from '../../entities/types';
import {
  MOCK_EVENTS,
  MOCK_PRODUCTS,
  SEEDED_ORDERS,
  getMockEvent,
  getMockProduct,
  getMockOrder,
} from './mock-data';
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
  return {
    events_count: MOCK_EVENTS.length,
    orders_count: SEEDED_ORDERS.length,
    revenue: SEEDED_ORDERS.reduce((sum, o) => sum + o.total, 0),
    customers_count: 8,
  };
}

// ── CRM Events ──

export async function getCrmEvents(): Promise<Event[]> {
  return [...MOCK_EVENTS];
}

export async function getCrmEvent(id: number | string): Promise<Event> {
  const event = getMockEvent(id);
  if (!event) throw new Error('Event not found');
  return event;
}

export async function createCrmEvent(data: Partial<Event>): Promise<Event> {
  // Mock: return a fake created event
  return {
    id: Math.floor(Math.random() * 9000) + 1000,
    title: data.title ?? 'New Event',
    description: data.description ?? '',
    format: data.format ?? 'offline',
    start_datetime: data.start_datetime ?? new Date().toISOString(),
    end_datetime: data.end_datetime ?? new Date().toISOString(),
    is_free: data.is_free ?? false,
    status: 'draft',
    location: data.location,
    online_info: data.online_info,
    ticket_types: data.ticket_types ?? [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateCrmEvent(id: number | string, data: Partial<Event>): Promise<Event> {
  const event = getMockEvent(id);
  if (!event) throw new Error('Event not found');
  return { ...event, ...data, updated_at: new Date().toISOString() };
}

export async function publishCrmEvent(id: number | string): Promise<Event> {
  return updateCrmEvent(id, { status: 'published' });
}

export async function unpublishCrmEvent(id: number | string): Promise<Event> {
  return updateCrmEvent(id, { status: 'draft' });
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
