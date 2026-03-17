export interface User {
  id: string
  username: string
  email: string
  token: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}
