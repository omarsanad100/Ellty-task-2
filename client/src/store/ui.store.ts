import { create } from 'zustand'
import type { AuthUser } from '../api/auth.api'

type AuthMode = 'login' | 'register'

interface UiState {
  authMode: AuthMode
  token: string
  user: AuthUser | null
  isAuthModalOpen: boolean
  setAuthMode: (mode: AuthMode) => void
  openAuthModal: (mode?: AuthMode) => void
  closeAuthModal: () => void
  setAuthSession: (token: string, user: AuthUser) => void
  logout: () => void
}

const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem('auth_user')
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null) {
      const id = Reflect.get(parsed, 'id')
      const username = Reflect.get(parsed, 'username')
      const createdAt = Reflect.get(parsed, 'createdAt')
      if (
        typeof id === 'string' &&
        typeof username === 'string' &&
        typeof createdAt === 'string'
      ) {
        return { id, username, createdAt }
      }
    }
  } catch {
    return null
  }
  return null
}

export const useUiStore = create<UiState>(set => ({
  authMode: 'login',
  token: localStorage.getItem('auth_token') ?? '',
  user: getStoredUser(),
  isAuthModalOpen: false,
  setAuthMode: mode => set({ authMode: mode }),
  openAuthModal: mode => set(state => ({ isAuthModalOpen: true, authMode: mode ?? state.authMode })),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthSession: (token, user) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ token, user, isAuthModalOpen: false })
    window.location.reload()
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ token: '', user: null })
    window.location.reload()
  }
}))
