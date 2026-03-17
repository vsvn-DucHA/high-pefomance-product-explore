import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between'>
        <Link
          to='/'
          className='flex items-center gap-2 hover:opacity-80 transition-opacity'
        >
          <ShoppingBag className='w-6 h-6 text-primary' />
          <span className='font-bold text-lg text-gray-900'>
            Product Explorer
          </span>
        </Link>

        <div className='flex items-center gap-4'>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className='inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'>
                <Avatar className='w-7 h-7'>
                  <AvatarFallback className='text-xs bg-primary/10 text-primary font-semibold'>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium hidden sm:inline'>
                  {user.username}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem
                  disabled
                  className='flex items-center gap-2 opacity-60'
                >
                  <User className='w-4 h-4' />
                  <div>
                    <p className='text-sm font-medium'>{user.username}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-red-600 cursor-pointer'
                >
                  <LogOut className='w-4 h-4 mr-2' />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
