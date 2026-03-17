import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ShoppingBag, LogIn } from 'lucide-react'
import { z } from 'zod'

// ── Zod Schema ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscores',
    )
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

type LoginSchema = z.infer<typeof loginSchema>
type FieldErrors = Partial<Record<keyof LoginSchema, string>>

// ── Component ────────────────────────────────────────────────────────────────
export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateField = (field: keyof LoginSchema, value: string) => {
    const result = loginSchema.shape[field].safeParse(value)
    setFieldErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError('')

    const result = loginSchema.safeParse({ username, password })
    if (!result.success) {
      const errors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginSchema
        if (field && !errors[field]) errors[field] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    // Simulate real API calls with setTimeout
    setTimeout(() => {
      try {
        login({
          username: result.data.username,
          password: result.data.password,
        })
        navigate(from, { replace: true })
      } catch (err) {
        setServerError(
          err instanceof Error
            ? err.message
            : 'Login failed. Please try again.',
        )
        setLoading(false)
      }
    }, 1500)
  }

  return (
    <div className='flex-1 flex items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center space-y-2'>
          <div className='flex justify-center'>
            <div className='bg-primary/10 p-3 rounded-full'>
              <ShoppingBag className='w-8 h-8 text-primary' />
            </div>
          </div>
        </CardHeader>

        <CardContent className='text-left'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Username */}
            <div className='space-y-1'>
              <label
                htmlFor='username'
                className='text-sm font-medium text-gray-700'
              >
                Username
              </label>
              <Input
                id='username'
                type='text'
                placeholder='e.g. john_doe123'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => validateField('username', username)}
                disabled={loading}
                autoComplete='username'
                autoFocus
                className={
                  fieldErrors.username
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {fieldErrors.username && (
                <p className='text-xs text-red-500'>{fieldErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-1'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <Input
                id='password'
                type='password'
                placeholder='Min 6 chars, 1 uppercase, 1 number'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                disabled={loading}
                autoComplete='current-password'
                className={
                  fieldErrors.password
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {fieldErrors.password && (
                <p className='text-xs text-red-500'>{fieldErrors.password}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <p
                className='text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md'
                role='alert'
              >
                {serverError}
              </p>
            )}

            {/* Submit */}
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <>
                  <span className='w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className='w-4 h-4 mr-2' />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className='text-xs text-center text-gray-500 mt-4'>
            Username: letters/numbers/underscore · Password: 6+ chars, 1
            uppercase, 1 number
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
