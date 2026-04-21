import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/common/ProtectedRoute';
import { PageLoader } from './components/common/Loader';

// Lazy-loaded pages for code splitting
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Trips = lazy(() => import('./pages/Trips'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const AddExpense = lazy(() => import('./pages/AddExpense'));
const Explore = lazy(() => import('./pages/Explore'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LazyPage({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <LazyPage>
        <Auth />
      </LazyPage>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Dashboard />
          </LazyPage>
        ),
      },
      {
        path: 'trips',
        element: (
          <LazyPage>
            <Trips />
          </LazyPage>
        ),
      },
      {
        path: 'trips/:tripId',
        element: (
          <LazyPage>
            <TripDetail />
          </LazyPage>
        ),
      },
      {
        path: 'add-expense',
        element: (
          <LazyPage>
            <AddExpense />
          </LazyPage>
        ),
      },
      {
        path: 'explore',
        element: (
          <LazyPage>
            <Explore />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <LazyPage>
        <NotFound />
      </LazyPage>
    ),
  },
]);

export default router;
