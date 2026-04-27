import { create } from 'zustand'

type AuthMode = 'login' | 'register'

interface UiState {
  authMode: AuthMode
  setAuthMode: (mode: AuthMode) => void
}

export const useUiStore = create<UiState>(set => ({
  authMode: 'login',
  setAuthMode: mode => set({ authMode: mode })
}))
