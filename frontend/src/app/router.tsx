import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { EventsListPage } from '../pages/EventsListPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { ProductsListPage } from '../pages/ProductsListPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CrmDashboardPage } from '../pages/CrmDashboardPage';
import { CrmEventsPage } from '../pages/CrmEventsPage';
import { CrmEventCreatePage } from '../pages/CrmEventCreatePage';
import { CrmEventEditPage } from '../pages/CrmEventEditPage';
import { CrmProductsPage } from '../pages/CrmProductsPage';
import { CrmProductCreatePage } from '../pages/CrmProductCreatePage';
import { CrmProductEditPage } from '../pages/CrmProductEditPage';
import { CrmOrdersPage } from '../pages/CrmOrdersPage';
import { CrmOrderDetailsPage } from '../pages/CrmOrderDetailsPage';
import { CrmCustomersPage } from '../pages/CrmCustomersPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/events', element: <EventsListPage /> },
  { path: '/events/:id', element: <EventDetailsPage /> },
  { path: '/shop', element: <ProductsListPage /> },
  { path: '/products/:id', element: <ProductDetailsPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/payment/:orderId', element: <PaymentPage /> },
  { path: '/orders/:id', element: <OrderDetailsPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/crm',
    children: [
      { index: true, element: <CrmDashboardPage /> },
      { path: 'events', element: <CrmEventsPage /> },
      { path: 'events/new', element: <CrmEventCreatePage /> },
      { path: 'events/:id/edit', element: <CrmEventEditPage /> },
      { path: 'products', element: <CrmProductsPage /> },
      { path: 'products/new', element: <CrmProductCreatePage /> },
      { path: 'products/:id/edit', element: <CrmProductEditPage /> },
      { path: 'orders', element: <CrmOrdersPage /> },
      { path: 'orders/:id', element: <CrmOrderDetailsPage /> },
      { path: 'customers', element: <CrmCustomersPage /> },
    ],
  },
]);
