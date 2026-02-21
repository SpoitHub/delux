import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';

export const OrganizerLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user?.is_organizer) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/crm" className="text-xl font-bold text-blue-600">Delux CRM</Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/crm" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Dashboard</Link>
          <Link to="/crm/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Events</Link>
          <Link to="/crm/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Products</Link>
          <Link to="/crm/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Orders</Link>
          <Link to="/crm/customers" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Customers</Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Back to Site</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-900">Organizer Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">{user.first_name || user.email}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
