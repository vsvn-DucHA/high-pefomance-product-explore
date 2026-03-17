import { Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { queryClient } from '@/lib/queryClient'
import { Header } from '@/components/layout/Header'

export function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className='min-h-dvh flex flex-col bg-gray-50'>
          <Header />
          <main className='flex-1 flex flex-col max-h-[calc(100dvh-4.5rem)] overflow-hidden'>
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}
