import type { Event, Product, Order } from "../../entities/types";
import { apiRequest, getAuthToken } from "./client";

// ── Dashboard ──

export interface DashboardStats {
  events_count: number;
  orders_count: number;
  revenue: number;
  customers_count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/crm/dashboard/", {}, getAuthToken());
}

// ── CRM Events ──

export interface CrmEventPayload {
  title?: string;
  description?: string;
  format?: "online" | "offline";
  start_datetime?: string;
  end_datetime?: string;
  is_free?: boolean;
  status?: "draft" | "published" | "cancelled" | "completed";
  location?: { city: string; address: string } | null;
  online_info?: { url: string; platform?: string } | null;
  ticket_types?: Array<{
    id?: number;
    name: string;
    price: number;
    quantity_total: number;
  }>;
  image?: File | null;
}

export async function getCrmEvents(): Promise<Event[]> {
  return apiRequest<Event[]>("/crm/events/", {}, getAuthToken());
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
  if (location !== undefined) form.append("location", JSON.stringify(location));
  if (online_info !== undefined)
    form.append("online_info", JSON.stringify(online_info));
  if (ticket_types !== undefined)
    form.append("ticket_types", JSON.stringify(ticket_types));

  // Image file
  if (image) form.append("image", image);

  return apiRequest<Event>(
    "/crm/events/",
    { method: "POST", body: form },
    getAuthToken(),
  );
}

export async function updateCrmEvent(
  id: number | string,
  data: CrmEventPayload,
): Promise<Event> {
  return apiRequest<Event>(
    `/crm/events/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    getAuthToken(),
  );
}

export async function deleteCrmEvent(id: number | string): Promise<void> {
  await apiRequest<void>(
    `/crm/events/${id}/`,
    { method: "DELETE" },
    getAuthToken(),
  );
}

export async function publishCrmEvent(id: number | string): Promise<Event> {
  await apiRequest<{ status: string }>(
    `/crm/events/${id}/publish/`,
    {
      method: "POST",
    },
    getAuthToken(),
  );
  return getCrmEvent(id);
}

export async function unpublishCrmEvent(id: number | string): Promise<Event> {
  await apiRequest<{ status: string }>(
    `/crm/events/${id}/unpublish/`,
    {
      method: "POST",
    },
    getAuthToken(),
  );
  return getCrmEvent(id);
}

// ── CRM Products ──

export interface CrmProductPayload {
  title?: string;
  description?: string;
  price?: number | string;
  category_id?: number | null;
  stock_quantity?: number | string;
  is_active?: boolean;
  image?: File | null;
}

export async function getCrmCategories(): Promise<
  import("../../entities/types").Category[]
> {
  return apiRequest("/crm/products/categories/", {}, getAuthToken());
}

export async function createCategory(
  name: string,
): Promise<import("../../entities/types").Category> {
  return apiRequest(
    "/crm/products/categories/",
    {
      method: "POST",
      body: JSON.stringify({ name }),
    },
    getAuthToken(),
  );
}

export async function getCrmProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/crm/products/", {}, getAuthToken());
}

export async function getCrmProduct(id: number | string): Promise<Product> {
  return apiRequest<Product>(`/crm/products/${id}/`, {}, getAuthToken());
}

export async function createCrmProduct(
  data: CrmProductPayload,
): Promise<Product> {
  const { image, ...rest } = data;
  const form = new FormData();
  for (const [key, val] of Object.entries(rest)) {
    if (val !== undefined && val !== null) form.append(key, String(val));
  }
  if (image) form.append("image", image);
  return apiRequest<Product>(
    "/crm/products/",
    { method: "POST", body: form },
    getAuthToken(),
  );
}

export async function updateCrmProduct(
  id: number | string,
  data: CrmProductPayload,
): Promise<Product> {
  const { image, ...rest } = data;
  const form = new FormData();
  for (const [key, val] of Object.entries(rest)) {
    if (val !== undefined && val !== null) form.append(key, String(val));
  }
  if (image) form.append("image", image);
  return apiRequest<Product>(
    `/crm/products/${id}/`,
    { method: "PATCH", body: form },
    getAuthToken(),
  );
}

export async function deleteCrmProduct(id: number | string): Promise<void> {
  await apiRequest<void>(
    `/crm/products/${id}/`,
    { method: "DELETE" },
    getAuthToken(),
  );
}

export async function addProductImage(
  productId: number | string,
  imageFile: File,
  isPrimary = false,
): Promise<{ id: number; image: string; is_primary: boolean }> {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("is_primary", String(isPrimary));
  return apiRequest(
    `/crm/products/${productId}/images/`,
    { method: "POST", body: form },
    getAuthToken(),
  );
}

// ── CRM Orders ──

export interface CrmOrderFilters {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}

export async function getCrmOrders(
  filters?: CrmOrderFilters,
): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.payment_status)
    params.append("payment_status", filters.payment_status);
  // Optional date filters can be added here if needed

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await apiRequest<{ results?: Order[] } | Order[]>(`/crm/orders/${query}`, {}, getAuthToken());
  return Array.isArray(res) ? res : (res.results ?? []);
}

export async function getCrmOrder(id: number | string): Promise<Order> {
  return apiRequest<Order>(`/crm/orders/${id}/`, {}, getAuthToken());
}

export async function updateCrmOrderStatus(
  id: number | string,
  status: Order["status"],
): Promise<Order> {
  return apiRequest<Order>(
    `/crm/orders/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    getAuthToken(),
  );
}

// ── CRM Customers ──

export interface CrmCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  total_spent: string | number;
  last_order_date: string | null;
  notes: { id: number; note_text: string; created_at: string }[];
  orders: Order[];
}

export async function getCrmCustomers(): Promise<CrmCustomer[]> {
  const res = await apiRequest<{ results?: CrmCustomer[] } | CrmCustomer[]>("/crm/customers/", {}, getAuthToken());
  return Array.isArray(res) ? res : (res.results ?? []);
}

export async function getCrmCustomer(
  userId: number | string,
): Promise<CrmCustomer> {
  return apiRequest<CrmCustomer>(
    `/crm/customers/${userId}/`,
    {},
    getAuthToken(),
  );
}

export async function addCustomerNote(
  userId: number | string,
  note: string,
): Promise<CrmCustomer> {
  await apiRequest(
    `/crm/customers/${userId}/notes/`,
    {
      method: "POST",
      body: JSON.stringify({ note_text: note }),
    },
    getAuthToken(),
  );
  return getCrmCustomer(userId);
}
