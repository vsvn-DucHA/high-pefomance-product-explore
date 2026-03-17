import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/pages/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { LoginPage } from '@/pages/Login'
import { ProductDetailPage } from '@/pages/ProductDetail'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:productId',
        element: (
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: (
          <div className='flex flex-col items-center justify-center py-24 text-center px-4'>
            <h1 className='text-4xl font-bold text-gray-300 mb-4'>404</h1>
            <p className='text-gray-500'>Page not found.</p>
          </div>
        ),
      },
    ],
  },
])
