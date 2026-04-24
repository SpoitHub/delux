import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";
import exec from "k6/execution";

const BASE_URL = (__ENV.BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const API_PREFIX = __ENV.API_PREFIX || "/api/v1";
const BASE_PASS = __ENV.K6_USER_PASSWORD || "k6-test-pass-123";
const LOGIN_EMAIL = __ENV.K6_LOGIN_EMAIL || "k6.login@example.com";

const ENDPOINT_LATENCY = new Trend("endpoint_latency_ms");
const CHECKOUT_FLOW_DURATION = new Trend("checkout_flow_duration_ms");
const CHECKOUT_SUCCESS = new Counter("checkout_success_total");
const CHECKOUT_SKIPPED = new Counter("checkout_skipped_total");

const BROWSE_TARGET = Number(__ENV.BROWSE_TARGET_VUS || 100);
const BROWSE_RAMP_UP = __ENV.BROWSE_RAMP_UP || "2m";
const BROWSE_HOLD = __ENV.BROWSE_HOLD || "3m";
const BROWSE_RAMP_DOWN = __ENV.BROWSE_RAMP_DOWN || "1m";

const LOGIN_RPS = Number(__ENV.LOGIN_RPS || 20);
const LOGIN_DURATION = __ENV.LOGIN_DURATION || "4m";
const LOGIN_PRE_ALLOCATED_VUS = Number(__ENV.LOGIN_PRE_ALLOCATED_VUS || 40);
const LOGIN_MAX_VUS = Number(__ENV.LOGIN_MAX_VUS || 200);

const CHECKOUT_START_RATE = Number(__ENV.CHECKOUT_START_RATE || 1);
const CHECKOUT_PEAK_RATE = Number(__ENV.CHECKOUT_PEAK_RATE || 6);
const CHECKOUT_RAMP_UP = __ENV.CHECKOUT_RAMP_UP || "2m";
const CHECKOUT_HOLD = __ENV.CHECKOUT_HOLD || "3m";
const CHECKOUT_RAMP_DOWN = __ENV.CHECKOUT_RAMP_DOWN || "1m";
const CHECKOUT_PRE_ALLOCATED_VUS = Number(__ENV.CHECKOUT_PRE_ALLOCATED_VUS || 20);
const CHECKOUT_MAX_VUS = Number(__ENV.CHECKOUT_MAX_VUS || 120);

export const options = {
  scenarios: {
    public_browse: {
      executor: "ramping-vus",
      exec: "publicBrowse",
      startVUs: 0,
      stages: [
        { duration: BROWSE_RAMP_UP, target: BROWSE_TARGET },
        { duration: BROWSE_HOLD, target: BROWSE_TARGET },
        { duration: BROWSE_RAMP_DOWN, target: 0 },
      ],
      gracefulRampDown: "30s",
    },
    auth_login: {
      executor: "constant-arrival-rate",
      exec: "loginLoad",
      duration: LOGIN_DURATION,
      rate: LOGIN_RPS,
      timeUnit: "1s",
      preAllocatedVUs: LOGIN_PRE_ALLOCATED_VUS,
      maxVUs: LOGIN_MAX_VUS,
    },
    checkout_flow: {
      executor: "ramping-arrival-rate",
      exec: "checkoutFlow",
      startRate: CHECKOUT_START_RATE,
      timeUnit: "1s",
      preAllocatedVUs: CHECKOUT_PRE_ALLOCATED_VUS,
      maxVUs: CHECKOUT_MAX_VUS,
      stages: [
        { duration: CHECKOUT_RAMP_UP, target: CHECKOUT_PEAK_RATE },
        { duration: CHECKOUT_HOLD, target: CHECKOUT_PEAK_RATE },
        { duration: CHECKOUT_RAMP_DOWN, target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1000"],
    checks: ["rate>0.95"],
    checkout_flow_duration_ms: ["p(95)<3000"],
  },
};

function apiUrl(path) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

function jsonHeaders(accessToken) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

function safeJson(response) {
  try {
    return response.json();
  } catch (_) {
    return null;
  }
}

function request(name, method, path, body, params = {}) {
  const url = apiUrl(path);
  const response = http.request(method, url, body, params);
  ENDPOINT_LATENCY.add(response.timings.duration, {
    name,
    method,
    path,
    status: String(response.status),
  });
  return response;
}

function registerUser(email, password) {
  const payload = JSON.stringify({
    email,
    password,
    first_name: "K6",
    last_name: "Load",
    phone: "+77000000000",
  });
  const response = request(
    "register",
    "POST",
    "/auth/register/",
    payload,
    { headers: jsonHeaders() },
  );

  check(response, {
    "register: created or already exists": (r) => r.status === 201 || r.status === 400,
  });

  return response;
}

function login(email, password) {
  const payload = JSON.stringify({ email, password });
  const response = request(
    "login",
    "POST",
    "/auth/login/",
    payload,
    { headers: jsonHeaders() },
  );

  const data = safeJson(response);
  const ok = check(response, {
    "login: status 200": (r) => r.status === 200,
    "login: has access token": () => !!(data && data.access),
  });

  if (!ok || !data || !data.access) {
    return null;
  }

  return data.access;
}

function getPublicIds() {
  const eventList = request("events_list", "GET", "/events/?page=1", null);
  const eventsData = safeJson(eventList);
  const eventId = eventsData && eventsData.results && eventsData.results.length > 0
    ? eventsData.results[0].id
    : null;

  const productList = request("products_list", "GET", "/products/?page=1", null);
  const productsData = safeJson(productList);
  const productId = productsData && productsData.results && productsData.results.length > 0
    ? productsData.results[0].id
    : null;

  return { eventId, productId };
}

export function setup() {
  registerUser(LOGIN_EMAIL, BASE_PASS);
  const token = login(LOGIN_EMAIL, BASE_PASS);
  if (!token) {
    throw new Error("k6 setup failed: cannot login with K6_LOGIN_EMAIL/K6_USER_PASSWORD");
  }
  return { ...getPublicIds() };
}

export function publicBrowse(data) {
  group("Public browse", () => {
    const events = request("events_list", "GET", "/events/?search=&page=1", null);
    check(events, {
      "events list: status 200": (r) => r.status === 200,
    });

    const products = request("products_list", "GET", "/products/?search=&page=1", null);
    check(products, {
      "products list: status 200": (r) => r.status === 200,
    });

    if (data.eventId) {
      const detail = request("event_detail", "GET", `/events/${data.eventId}/`, null);
      check(detail, {
        "event detail: status 200": (r) => r.status === 200,
      });

      const tickets = request("event_tickets", "GET", `/events/${data.eventId}/tickets/`, null);
      check(tickets, {
        "event tickets: status 200": (r) => r.status === 200,
      });
    }

    if (data.productId) {
      const detail = request("product_detail", "GET", `/products/${data.productId}/`, null);
      check(detail, {
        "product detail: status 200": (r) => r.status === 200,
      });
    }
  });

  sleep(Math.random() * 1.2 + 0.2);
}

export function loginLoad() {
  const token = login(LOGIN_EMAIL, BASE_PASS);
  check(token, {
    "auth_login scenario: token received": (t) => !!t,
  });
  sleep(Math.random() * 0.5);
}

export function checkoutFlow(data) {
  const started = Date.now();
  const suffix = `${exec.vu.idInTest}-${exec.scenario.iterationInTest}`;
  const email = `k6.checkout.${suffix}@example.com`;

  registerUser(email, BASE_PASS);
  const token = login(email, BASE_PASS);

  if (!token || !data.productId) {
    CHECKOUT_SKIPPED.add(1);
    CHECKOUT_FLOW_DURATION.add(Date.now() - started);
    return;
  }

  const authHeaders = { headers: jsonHeaders(token) };

  group("Checkout flow", () => {
    const addToCartPayload = JSON.stringify({
      item_type: "product",
      product_id: data.productId,
      quantity: 1,
    });
    const addToCart = request("cart_add_item", "POST", "/cart/items/", addToCartPayload, authHeaders);
    const addToCartOk = check(addToCart, {
      "cart add item: status 201": (r) => r.status === 201,
    });
    if (!addToCartOk) {
      CHECKOUT_SKIPPED.add(1);
      return;
    }

    const orderPayload = JSON.stringify({
      delivery_type: "pickup",
      contact: { name: "K6 User", phone: "+77001234567" },
    });
    const createOrder = request("order_create", "POST", "/orders/", orderPayload, authHeaders);
    const orderData = safeJson(createOrder);
    const createOrderOk = check(createOrder, {
      "order create: status 201": (r) => r.status === 201,
      "order create: id present": () => !!(orderData && orderData.id),
    });
    if (!createOrderOk || !orderData || !orderData.id) {
      CHECKOUT_SKIPPED.add(1);
      return;
    }

    const paymentPayload = JSON.stringify({ order_id: orderData.id });
    const charge = request("payment_charge", "POST", "/payments/mock/charge/", paymentPayload, authHeaders);
    const charged = check(charge, {
      "payment charge: status 200": (r) => r.status === 200,
    });

    if (charged) {
      CHECKOUT_SUCCESS.add(1);
    } else {
      CHECKOUT_SKIPPED.add(1);
    }
  });

  CHECKOUT_FLOW_DURATION.add(Date.now() - started);
  sleep(Math.random() * 0.8 + 0.2);
}
