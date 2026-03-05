/**
 * Mock data for development without backend.
 * Provides realistic events, products, cart, and orders.
 */

import type {
  Event,
  EventsResponse,
  Product,
  ProductsResponse,
  Category,
  Cart,
  CartItem,
  Order,
} from '../../entities/types';

// ── Images (Unsplash placeholders) ──

const eventImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c7e164?w=800&q=80',
  'https://images.unsplash.com/photo-1461896836934-bd45ba3c0a9e?w=800&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800&q=80',
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
];

const productImages = [
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80',
  'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
  'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&q=80',
  'https://images.unsplash.com/photo-1515775054797-88c1676e85e5?w=600&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
];

// ── Categories ──

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Apparel', slug: 'apparel' },
  { id: 2, name: 'Footwear', slug: 'footwear' },
  { id: 3, name: 'Accessories', slug: 'accessories' },
  { id: 4, name: 'Equipment', slug: 'equipment' },
];

// ── Events ──

const now = new Date();
const future = (days: number, hours = 10) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Urban Marathon 2026',
    description:
      'The biggest city marathon of the year. Run through historical districts, waterfront paths, and finish at the main stadium. Professional timing, hydration stations every 3 km, live entertainment along the route. Categories: 5K, 10K, Half Marathon, Full Marathon.',
    format: 'offline',
    start_datetime: future(14, 8),
    end_datetime: future(14, 16),
    is_free: false,
    status: 'published',
    location: { city: 'New York', address: 'Central Park West' },
    ticket_types: [
      { id: 1, name: '5K Run', price: 3500, quantity_total: 500, quantity_sold: 342 },
      { id: 2, name: '10K Run', price: 5000, quantity_total: 300, quantity_sold: 198 },
      { id: 3, name: 'Half Marathon', price: 8000, quantity_total: 200, quantity_sold: 176 },
      { id: 4, name: 'Full Marathon', price: 12000, quantity_total: 100, quantity_sold: 89 },
    ],
    image: eventImages[0],
    organizer: { id: 1, company_name: 'RunCity Events' },
    created_at: future(-30),
    updated_at: future(-5),
  },
  {
    id: 2,
    title: 'CrossFit Championship — West Region',
    description:
      'The ultimate test of functional fitness. Athletes from across the western region compete in grueling WODs (Workout of the Day) including weightlifting, gymnastics, and metabolic conditioning. Includes individual and team divisions. Live DJ, food court, vendors area.',
    format: 'offline',
    start_datetime: future(7, 9),
    end_datetime: future(8, 20),
    is_free: false,
    status: 'published',
    location: { city: 'Los Angeles', address: 'Convention Center, Hall B' },
    ticket_types: [
      { id: 5, name: 'Spectator — Day 1', price: 2000, quantity_total: 2000, quantity_sold: 1456 },
      { id: 6, name: 'Spectator — Full Pass', price: 3500, quantity_total: 1500, quantity_sold: 987 },
      { id: 7, name: 'VIP Full Pass', price: 15000, quantity_total: 100, quantity_sold: 100 },
    ],
    image: eventImages[1],
    organizer: { id: 1, company_name: 'RunCity Events' },
    created_at: future(-45),
    updated_at: future(-10),
  },
  {
    id: 3,
    title: 'Mountain Trail Ultra 80K',
    description:
      'An epic 80-kilometer trail run through mountain passes, alpine meadows, and forest trails. Elevation gain: 4,200m. Aid stations with hot food every 15 km. GPS tracking for all participants. Night section with mandatory headlamp. Not for the faint of heart.',
    format: 'offline',
    start_datetime: future(21, 5),
    end_datetime: future(22, 0),
    is_free: false,
    status: 'published',
    location: { city: 'Denver', address: 'Rocky Mountain Trailhead' },
    ticket_types: [
      { id: 8, name: 'Runner Entry', price: 18000, quantity_total: 150, quantity_sold: 112 },
      { id: 9, name: 'Supporter Pass', price: 1500, quantity_total: 300, quantity_sold: 67 },
    ],
    image: eventImages[2],
    organizer: { id: 2, company_name: 'Trail Legends' },
    created_at: future(-60),
    updated_at: future(-3),
  },
  {
    id: 4,
    title: 'E-Sports Arena: League Finals',
    description:
      'Watch the top 8 teams battle for the championship title live. Broadcast in 4K with professional commentary. Interactive voting, giveaways, and meet-and-greet with players after the event. Stream available worldwide.',
    format: 'online',
    start_datetime: future(3, 18),
    end_datetime: future(3, 23),
    is_free: true,
    status: 'published',
    online_info: { url: 'https://stream.delux.net/esports-finals', platform: 'Delux Stream' },
    ticket_types: [],
    image: eventImages[3],
    organizer: { id: 3, company_name: 'Digital Arena' },
    created_at: future(-14),
    updated_at: future(-1),
  },
  {
    id: 5,
    title: 'Yoga & Wellness Weekend Retreat',
    description:
      'Disconnect from the daily grind and reconnect with yourself. Two days of guided yoga sessions (Vinyasa, Yin, Hatha), meditation workshops, breathwork, and plant-based nutrition seminars. All levels welcome. Mats and props provided.',
    format: 'offline',
    start_datetime: future(10, 7),
    end_datetime: future(11, 18),
    is_free: false,
    status: 'published',
    location: { city: 'Austin', address: 'Lakeside Wellness Center' },
    ticket_types: [
      { id: 10, name: 'Day Pass', price: 4500, quantity_total: 80, quantity_sold: 55 },
      { id: 11, name: 'Full Weekend', price: 8000, quantity_total: 60, quantity_sold: 41 },
    ],
    image: eventImages[4],
    organizer: { id: 4, company_name: 'ZenFit Studio' },
    created_at: future(-20),
    updated_at: future(-2),
  },
  {
    id: 6,
    title: 'Boxing Night: Champions Clash',
    description:
      'An explosive night of professional boxing featuring 6 undercard bouts and a main event world-title fight. Live ring-side experience with giant screens, premium bar, and after-party for VIP ticket holders.',
    format: 'offline',
    start_datetime: future(28, 19),
    end_datetime: future(28, 23),
    is_free: false,
    status: 'published',
    location: { city: 'Las Vegas', address: 'Grand Arena, Strip Blvd' },
    ticket_types: [
      { id: 12, name: 'Standard', price: 7500, quantity_total: 5000, quantity_sold: 3890 },
      { id: 13, name: 'Ring Side', price: 25000, quantity_total: 200, quantity_sold: 200 },
      { id: 14, name: 'VIP Lounge', price: 50000, quantity_total: 50, quantity_sold: 38 },
    ],
    image: eventImages[5],
    organizer: { id: 5, company_name: 'Fight Night Promotions' },
    created_at: future(-90),
    updated_at: future(-7),
  },
  {
    id: 7,
    title: 'Strength Training Masterclass',
    description:
      'Online masterclass with Olympic weightlifting coach Alex Petrov. Covers: squat mechanics, deadlift progressions, bench press setup, programming for hypertrophy vs. strength. Includes Q&A session and downloadable training plan.',
    format: 'online',
    start_datetime: future(5, 17),
    end_datetime: future(5, 20),
    is_free: false,
    status: 'published',
    online_info: { url: 'https://stream.delux.net/masterclass', platform: 'Zoom' },
    ticket_types: [
      { id: 15, name: 'Standard Access', price: 2500, quantity_total: 500, quantity_sold: 210 },
      { id: 16, name: 'Premium (with recording)', price: 4500, quantity_total: 200, quantity_sold: 145 },
    ],
    image: eventImages[6],
    organizer: { id: 6, company_name: 'StrengthLab Academy' },
    created_at: future(-15),
    updated_at: future(-1),
  },
  {
    id: 8,
    title: 'Cycling Gran Fondo — Coastal Route',
    description:
      'A 160 km cycling event along stunning coastal roads. Rolling hills, ocean views, and a festive atmosphere at every checkpoint. Timed segments for competitive riders, but open to all skill levels. Post-ride BBQ and live music at the finish.',
    format: 'offline',
    start_datetime: future(35, 6),
    end_datetime: future(35, 17),
    is_free: false,
    status: 'published',
    location: { city: 'San Francisco', address: 'Marina Green Start Line' },
    ticket_types: [
      { id: 17, name: 'Rider Entry', price: 9500, quantity_total: 1000, quantity_sold: 654 },
      { id: 18, name: 'Family Supporter', price: 1000, quantity_total: 500, quantity_sold: 213 },
    ],
    image: eventImages[7],
    organizer: { id: 2, company_name: 'Trail Legends' },
    created_at: future(-40),
    updated_at: future(-4),
  },
  {
    id: 9,
    title: 'Outdoor Bootcamp — Free Community Event',
    description:
      'Join our free community bootcamp session in the park! High-intensity interval training for all fitness levels. Coaches will guide you through bodyweight exercises, partner drills, and functional fitness challenges. Bring water and a towel.',
    format: 'offline',
    start_datetime: future(2, 7),
    end_datetime: future(2, 9),
    is_free: true,
    status: 'published',
    location: { city: 'Chicago', address: 'Millennium Park, Great Lawn' },
    ticket_types: [],
    image: eventImages[8],
    organizer: { id: 4, company_name: 'ZenFit Studio' },
    created_at: future(-5),
    updated_at: future(-1),
  },
];

// ── Products ──

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Pro Training Shoes X9',
    description:
      'Lightweight and responsive training shoes designed for high-intensity workouts. Breathable mesh upper, reinforced heel cup, and cushioned midsole for maximum comfort during sprints, jumps, and lateral movements.',
    price: 24990,
    category: MOCK_CATEGORIES[1],
    stock_quantity: 45,
    is_active: true,
    images: [{ id: 1, image: productImages[0], is_primary: true }],
    rating: 4.8,
    created_at: future(-30),
    updated_at: future(-2),
  },
  {
    id: 2,
    title: 'AirStrike Running Sneakers',
    description:
      'Built for speed. Carbon fiber plate, nitrogen-infused foam, engineered knit upper. Designed for competitive runners looking for a race-day edge. Weighs only 198g.',
    price: 32990,
    category: MOCK_CATEGORIES[1],
    stock_quantity: 28,
    is_active: true,
    images: [{ id: 2, image: productImages[1], is_primary: true }],
    rating: 4.9,
    created_at: future(-25),
    updated_at: future(-1),
  },
  {
    id: 3,
    title: 'Urban Runner Pro',
    description:
      'Versatile road running shoe with excellent cushioning and durability. Perfect for daily training sessions, easy recovery runs, and long-distance efforts.',
    price: 18990,
    category: MOCK_CATEGORIES[1],
    stock_quantity: 62,
    is_active: true,
    images: [{ id: 3, image: productImages[2], is_primary: true }],
    rating: 4.5,
    created_at: future(-40),
    updated_at: future(-5),
  },
  {
    id: 4,
    title: 'Wireless Sport Earbuds — BassEdge',
    description:
      'Sweat-proof, deep bass, 12-hour battery life. Secure ear-hook design stays in place during the most intense workouts. Bluetooth 5.3 with low-latency mode for videos.',
    price: 14990,
    category: MOCK_CATEGORIES[2],
    stock_quantity: 120,
    is_active: true,
    images: [{ id: 4, image: productImages[3], is_primary: true }],
    rating: 4.6,
    created_at: future(-20),
    updated_at: future(-3),
  },
  {
    id: 5,
    title: 'Compression Training Tights',
    description:
      'High-performance compression leggings with moisture-wicking fabric and flatlock seams. Graduated compression improves circulation and reduces muscle fatigue. Reflective logo for visibility.',
    price: 8990,
    category: MOCK_CATEGORIES[0],
    stock_quantity: 85,
    is_active: true,
    images: [{ id: 5, image: productImages[4], is_primary: true }],
    rating: 4.4,
    created_at: future(-35),
    updated_at: future(-4),
  },
  {
    id: 6,
    title: 'DryFit Performance T-Shirt',
    description:
      'Ultra-light, quick-dry training tee. 4-way stretch fabric moves with you. Anti-odor technology keeps you fresh. Available in 8 colors.',
    price: 4990,
    category: MOCK_CATEGORIES[0],
    stock_quantity: 200,
    is_active: true,
    images: [{ id: 6, image: productImages[5], is_primary: true }],
    rating: 4.3,
    created_at: future(-50),
    updated_at: future(-6),
  },
  {
    id: 7,
    title: 'Insulated Hydration Bottle 750ml',
    description:
      'Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12. Leak-proof sport cap, one-hand operation. BPA-free stainless steel. Perfect for gym, trail, or commute.',
    price: 3490,
    category: MOCK_CATEGORIES[2],
    stock_quantity: 150,
    is_active: true,
    images: [{ id: 7, image: productImages[6], is_primary: true }],
    rating: 4.7,
    created_at: future(-15),
    updated_at: future(-2),
  },
  {
    id: 8,
    title: 'Training Hoodie — Stealth Black',
    description:
      'Premium heavyweight hoodie for warm-ups and casual wear. Soft-brushed fleece interior, kangaroo pocket, ribbed cuffs. Minimal design with embossed logo on chest.',
    price: 11990,
    category: MOCK_CATEGORIES[0],
    stock_quantity: 55,
    is_active: true,
    images: [{ id: 8, image: productImages[7], is_primary: true }],
    rating: 4.6,
    created_at: future(-22),
    updated_at: future(-1),
  },
  {
    id: 9,
    title: 'Adjustable Dumbbell Set 2-24kg',
    description:
      'Space-saving adjustable dumbbells with quick-change mechanism. Replace 15 pairs of fixed-weight dumbbells. Ergonomic grip, durable steel construction. Ideal for home gym setups.',
    price: 49990,
    category: MOCK_CATEGORIES[3],
    stock_quantity: 15,
    is_active: true,
    images: [{ id: 9, image: productImages[8], is_primary: true }],
    rating: 4.9,
    created_at: future(-60),
    updated_at: future(-8),
  },
  {
    id: 10,
    title: 'Resistance Band Set (5-Pack)',
    description:
      'Five color-coded resistance levels from 5 to 50 lbs. Latex-free TPE material, comfortable padded handles, door anchor and carry bag included. Great for rehab, warm-up, or full-body workouts.',
    price: 5990,
    category: MOCK_CATEGORIES[3],
    stock_quantity: 90,
    is_active: true,
    images: [{ id: 10, image: productImages[9], is_primary: true }],
    rating: 4.5,
    created_at: future(-10),
    updated_at: future(-1),
  },
  {
    id: 11,
    title: 'Gym Duffel Bag — 45L',
    description:
      'Spacious training bag with ventilated shoe compartment, wet pocket, and multiple organizer pockets. Water-resistant 600D polyester. Adjustable shoulder strap and padded handles.',
    price: 7490,
    category: MOCK_CATEGORIES[2],
    stock_quantity: 40,
    is_active: true,
    images: [{ id: 11, image: productImages[10], is_primary: true }],
    rating: 4.4,
    created_at: future(-28),
    updated_at: future(-3),
  },
  {
    id: 12,
    title: 'Yoga Mat Premium — 6mm',
    description:
      'Non-slip, eco-friendly yoga mat with alignment markings. Closed-cell construction prevents sweat absorption. Comes with carrying strap. Dimensions: 183 × 68 cm.',
    price: 6990,
    category: MOCK_CATEGORIES[3],
    stock_quantity: 0,
    is_active: true,
    images: [{ id: 12, image: productImages[11], is_primary: true }],
    rating: 4.7,
    created_at: future(-45),
    updated_at: future(-10),
  },
];

// ── Helper: build paginated responses ──

export function getMockEvents(filters?: {
  search?: string;
  format?: string;
  is_free?: boolean;
}): EventsResponse {
  let results = [...MOCK_EVENTS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location?.city.toLowerCase().includes(q),
    );
  }
  if (filters?.format) {
    results = results.filter((e) => e.format === filters.format);
  }
  if (filters?.is_free !== undefined) {
    results = results.filter((e) => e.is_free === filters.is_free);
  }

  return {
    count: results.length,
    next: null,
    previous: null,
    results,
  };
}

export function getMockProducts(filters?: {
  search?: string;
  category?: string;
}): ProductsResponse {
  let results = [...MOCK_PRODUCTS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (filters?.category) {
    results = results.filter(
      (p) => p.category?.name === filters.category || p.category?.slug === filters.category,
    );
  }

  return {
    count: results.length,
    next: null,
    previous: null,
    results,
  };
}

export function getMockEvent(id: number | string): Event | undefined {
  return MOCK_EVENTS.find((e) => e.id === Number(id));
}

export function getMockProduct(id: number | string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === Number(id));
}

// ── Seeded Orders (for CRM demo display) ──

export const SEEDED_ORDERS: Order[] = [
  {
    id: 1042,
    status: 'delivered',
    payment_status: 'paid',
    delivery_type: 'delivery',
    contact: { name: 'Alex Johnson', phone: '+1 555 0001' },
    shipping_address: { city: 'New York', address_line: '123 Main St', postal_code: '10001' },
    items: [
      { id: 1, item_type: 'product', product: MOCK_PRODUCTS[0], quantity: 2, unit_price: MOCK_PRODUCTS[0].price, total_price: MOCK_PRODUCTS[0].price * 2 },
    ],
    total: MOCK_PRODUCTS[0].price * 2,
    created_at: future(-10),
    updated_at: future(-10),
  },
  {
    id: 1043,
    status: 'processing',
    payment_status: 'paid',
    delivery_type: 'pickup',
    contact: { name: 'Sarah Smith', phone: '+1 555 0002' },
    items: [
      { id: 2, item_type: 'ticket', event: MOCK_EVENTS[1], ticket_type: MOCK_EVENTS[1].ticket_types[0], quantity: 1, unit_price: MOCK_EVENTS[1].ticket_types[0].price, total_price: MOCK_EVENTS[1].ticket_types[0].price },
    ],
    total: MOCK_EVENTS[1].ticket_types[0].price,
    created_at: future(-9),
    updated_at: future(-9),
  },
  {
    id: 1044,
    status: 'delivered',
    payment_status: 'paid',
    delivery_type: 'delivery',
    contact: { name: 'Mike Brown', phone: '+1 555 0003' },
    shipping_address: { city: 'Los Angeles', address_line: '456 Oak Ave', postal_code: '90001' },
    items: [
      { id: 3, item_type: 'product', product: MOCK_PRODUCTS[2], quantity: 1, unit_price: MOCK_PRODUCTS[2].price, total_price: MOCK_PRODUCTS[2].price },
    ],
    total: MOCK_PRODUCTS[2].price,
    created_at: future(-8),
    updated_at: future(-8),
  },
  {
    id: 1045,
    status: 'pending',
    payment_status: 'pending',
    delivery_type: 'none',
    contact: { name: 'Emma Davis', phone: '+1 555 0004' },
    items: [
      { id: 4, item_type: 'ticket', event: MOCK_EVENTS[0], ticket_type: MOCK_EVENTS[0].ticket_types[3], quantity: 2, unit_price: MOCK_EVENTS[0].ticket_types[3].price, total_price: MOCK_EVENTS[0].ticket_types[3].price * 2 },
    ],
    total: MOCK_EVENTS[0].ticket_types[3].price * 2,
    created_at: future(-7),
    updated_at: future(-7),
  },
  {
    id: 1046,
    status: 'cancelled',
    payment_status: 'refunded',
    delivery_type: 'delivery',
    contact: { name: 'James Wilson', phone: '+1 555 0005' },
    shipping_address: { city: 'Chicago', address_line: '789 Pine Rd', postal_code: '60601' },
    items: [
      { id: 5, item_type: 'product', product: MOCK_PRODUCTS[1], quantity: 1, unit_price: MOCK_PRODUCTS[1].price, total_price: MOCK_PRODUCTS[1].price },
    ],
    total: MOCK_PRODUCTS[1].price,
    created_at: future(-6),
    updated_at: future(-6),
  },
];

// ── Per-user cart (localStorage) ──

function cartKey(userId: number) { return `mock_cart_${userId}`; }

function loadCart(userId: number): Cart {
  try {
    const raw = localStorage.getItem(cartKey(userId));
    return raw ? JSON.parse(raw) : { id: userId, items: [], items_count: 0, total: 0 };
  } catch { return { id: userId, items: [], items_count: 0, total: 0 }; }
}

function saveCart(userId: number, cart: Cart) {
  localStorage.setItem(cartKey(userId), JSON.stringify(cart));
}

function recalcCart(cart: Cart) {
  cart.items_count = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.total = cart.items.reduce((s, i) => s + i.total_price, 0);
}

export function getMockCart(userId: number): Cart {
  return loadCart(userId);
}

export function addMockCartItem(
  userId: number,
  payload: { item_type: 'product' | 'ticket'; product_id?: number; ticket_type_id?: number; quantity: number },
): CartItem {
  const cart = loadCart(userId);

  const existingIdx = cart.items.findIndex((i) => {
    if (payload.item_type === 'product') return i.item_type === 'product' && i.product?.id === payload.product_id;
    return i.item_type === 'ticket' && i.ticket_type?.id === payload.ticket_type_id;
  });

  if (existingIdx >= 0) {
    const item = cart.items[existingIdx];
    item.quantity += payload.quantity;
    item.total_price = item.unit_price * item.quantity;
    recalcCart(cart);
    saveCart(userId, cart);
    return item;
  }

  const idCounter = cart.items.length > 0 ? Math.max(...cart.items.map((i) => i.id)) + 1 : 1;
  let newItem: CartItem;

  if (payload.item_type === 'product') {
    const product = MOCK_PRODUCTS.find((p) => p.id === payload.product_id);
    newItem = {
      id: idCounter,
      item_type: 'product',
      product,
      quantity: payload.quantity,
      unit_price: product?.price ?? 0,
      total_price: (product?.price ?? 0) * payload.quantity,
    };
  } else {
    const event = MOCK_EVENTS.find((e) => e.ticket_types.some((t) => t.id === payload.ticket_type_id));
    const ticketType = event?.ticket_types.find((t) => t.id === payload.ticket_type_id);
    newItem = {
      id: idCounter,
      item_type: 'ticket',
      event,
      ticket_type: ticketType,
      quantity: payload.quantity,
      unit_price: ticketType?.price ?? 0,
      total_price: (ticketType?.price ?? 0) * payload.quantity,
    };
  }

  cart.items.push(newItem);
  recalcCart(cart);
  saveCart(userId, cart);
  return newItem;
}

export function updateMockCartItem(userId: number, itemId: number, quantity: number): CartItem {
  const cart = loadCart(userId);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new Error('Item not found');
  item.quantity = quantity;
  item.total_price = item.unit_price * quantity;
  recalcCart(cart);
  saveCart(userId, cart);
  return item;
}

export function deleteMockCartItem(userId: number, itemId: number): void {
  const cart = loadCart(userId);
  cart.items = cart.items.filter((i) => i.id !== itemId);
  recalcCart(cart);
  saveCart(userId, cart);
}

export function clearMockCart(userId: number): void {
  saveCart(userId, { id: userId, items: [], items_count: 0, total: 0 });
}

// ── Per-user orders (localStorage) ──

function ordersKey(userId: number) { return `mock_orders_${userId}`; }

function loadOrders(userId: number): Order[] {
  try {
    const raw = localStorage.getItem(ordersKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveOrders(userId: number, orders: Order[]) {
  localStorage.setItem(ordersKey(userId), JSON.stringify(orders));
}

export function createMockOrder(
  userId: number,
  payload: {
    delivery_type: string;
    contact: { name: string; phone: string };
    shipping_address?: { city: string; address_line: string; postal_code?: string };
  },
): Order {
  const cart = loadCart(userId);
  const orders = loadOrders(userId);
  const newId = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1001;

  const order: Order = {
    id: newId,
    status: 'confirmed',
    payment_status: 'pending',
    delivery_type: payload.delivery_type as Order['delivery_type'],
    contact: payload.contact,
    shipping_address: payload.shipping_address,
    items: cart.items.map((item) => ({
      id: item.id,
      item_type: item.item_type,
      product: item.product,
      ticket_type: item.ticket_type,
      event: item.event,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
    total: cart.total,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  orders.push(order);
  saveOrders(userId, orders);
  clearMockCart(userId);
  return order;
}

export function getMockOrder(userId: number, id: number | string): Order | undefined {
  return loadOrders(userId).find((o) => o.id === Number(id));
}

export function getMockOrders(userId: number): Order[] {
  return loadOrders(userId).slice().reverse(); // новые сверху
}

// ── Mock Auth (user registry in localStorage) ──

interface StoredUser {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_organizer: boolean;
}

function loadUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem('mock_users') || '[]'); }
  catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem('mock_users', JSON.stringify(users));
}

export function mockRegister(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  const users = loadUsers();
  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const user: StoredUser = { ...data, id: newId, phone: '', is_organizer: false };
  users.push(user);
  saveUsers(users);
  return { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, phone: '', is_organizer: false };
}

export function mockLogin(email: string, password: string) {
  const users = loadUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) throw new Error('Invalid email or password');
  return {
    access: 'mock-access-' + Date.now(),
    refresh: 'mock-refresh-' + Date.now(),
    user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, phone: user.phone, is_organizer: user.is_organizer },
  };
}

export function mockUpdateProfile(
  userId: number,
  data: { first_name?: string; last_name?: string; phone?: string },
) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx < 0) {
    // Пользователь вошёл через старый механизм — создаём запись автоматически
    const stored = localStorage.getItem('mock_user');
    const current = stored ? JSON.parse(stored) : null;
    if (!current || current.id !== userId) throw new Error('User not found');
    const entry: StoredUser = {
      id: current.id,
      email: current.email,
      password: '',
      first_name: data.first_name ?? current.first_name ?? '',
      last_name: data.last_name ?? current.last_name ?? '',
      phone: data.phone ?? current.phone ?? '',
      is_organizer: current.is_organizer ?? false,
    };
    users.push(entry);
    saveUsers(users);
    return { id: entry.id, email: entry.email, first_name: entry.first_name, last_name: entry.last_name, phone: entry.phone, is_organizer: entry.is_organizer };
  }

  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  const u = users[idx];
  return { id: u.id, email: u.email, first_name: u.first_name, last_name: u.last_name, phone: u.phone, is_organizer: u.is_organizer };
}
