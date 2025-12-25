import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/auth/ProtectedRoute';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { OwnerLayout } from '@/components/layout/OwnerLayout';
import HomePage from '@/pages/Home';
import SearchPage from '@/pages/SearchPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import UnauthorizedPage from '@/pages/Unauthorized';
import OwnerDashboardPage from '@/pages/owner/OwnerDashboard';
import OwnerPropertiesPage from '@/pages/owner/OwnerPropertiesPage';
import OwnerRoomsPage from '@/pages/owner/OwnerRoomsPage';
import OwnerBookingsPage from '@/pages/owner/OwnerBookingsPage';
import OwnerInquiriesPage from '@/pages/owner/OwnerInquiriesPage';
import AboutPage from '@/pages/About';
import UserBookingsPage from '@/pages/UserBookingsPage';

const NotFound = () => (
  <div className="py-16 text-center">
    <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
    <p className="text-sm text-slate-600">Double-check the URL or return home.</p>
  </div>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/properties', element: <SearchPage /> },
      { path: '/properties/:id', element: <PropertyDetailPage /> },
      { path: '/my-bookings', element: (
        <ProtectedRoute>
          <UserBookingsPage />
        </ProtectedRoute>
      )},
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/owner',
    element: (
      <ProtectedRoute roles={['OWNER']}>
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OwnerDashboardPage /> },
      { path: 'properties', element: <OwnerPropertiesPage /> },
      { path: 'rooms', element: <OwnerRoomsPage /> },
      { path: 'bookings', element: <OwnerBookingsPage /> },
      { path: 'inquiries', element: <OwnerInquiriesPage /> },
    ],
  },
]);

export default router;
