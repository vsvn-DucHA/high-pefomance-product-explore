import { useNavigate, useLocation } from 'react-router-dom'

interface LocationState {
  from?: { pathname: string }
}

/**
 * Hook to navigate user after successful login.
 * Returns user to their intended destination or default route.
 */
export function useNavigateAfterLogin(defaultRoute = '/') {
  const navigate = useNavigate()
  const location = useLocation()

  return () => {
    const state = location.state as LocationState | null
    const from = state?.from?.pathname ?? defaultRoute

    // Navigate to intended route or default
    navigate(from, { replace: true })
  }
}
