// ── User & Auth ──

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_organizer: boolean;
}

export interface OrganizerProfile {
  id: number;
  user: number;
  company_name?: string;
  description?: string;
  created_at: string;
}

// ── Events ──

export interface EventLocation {
  city: string;
  address: string;
}

export interface OnlineInfo {
  url: string;
  platform?: string;
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity_total: number;
  quantity_sold: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  format: 'online' | 'offline';
  start_datetime: string;
  end_datetime: string;
  is_free: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  location?: EventLocation;
  online_info?: OnlineInfo;
  ticket_types: TicketType[];
  image?: string;
  organizer?: {
    id: number;
    company_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export interface EventFilters {
  search?: string;
  format?: 'online' | 'offline';
  is_free?: boolean;
  city?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}

// ── Products ──

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category?: Category;
  stock_quantity: number;
  is_active: boolean;
  images: ProductImage[];
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
}

// ── Cart ──

export interface CartItem {
  id: number;
  item_type: 'product' | 'ticket';
  product?: Product;
  ticket_type?: TicketType;
  event?: Event;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  items_count: number;
}

export interface AddCartItemPayload {
  item_type: 'product' | 'ticket';
  product_id?: number;
  ticket_type_id?: number;
  quantity: number;
}

// ── Orders ──

export interface ShippingAddress {
  city: string;
  address_line: string;
  postal_code?: string;
}

export interface OrderContact {
  name: string;
  phone: string;
}

export interface OrderItem {
  id: number;
  item_type: 'product' | 'ticket';
  product?: Product;
  ticket_type?: TicketType;
  event?: Event;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_type: 'none' | 'pickup' | 'delivery';
  contact: OrderContact;
  shipping_address?: ShippingAddress;
  items: OrderItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  delivery_type: 'none' | 'pickup' | 'delivery';
  contact: OrderContact;
  shipping_address?: ShippingAddress;
}

// ── Payments ──

export interface Payment {
  id: number;
  order: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
}
