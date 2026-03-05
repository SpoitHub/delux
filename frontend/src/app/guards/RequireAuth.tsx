import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store';

/**
 * Оборачивает маршруты, требующие авторизации.
 * Если пользователь не вошёл — редирект на /login с сохранением пути.
 */
export const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
};
