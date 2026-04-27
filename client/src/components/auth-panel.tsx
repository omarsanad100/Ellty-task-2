import { useUiStore } from '../store/ui.store'
import { SectionCard } from './section-card'

export const AuthPanel = () => {
  const authMode = useUiStore(state => state.authMode)
  const setAuthMode = useUiStore(state => state.setAuthMode)

  return (
    <SectionCard
      title="Authentication"
      description="UI scaffold only. API wiring will be added later."
    >
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 data-[active=true]:border-indigo-600 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700"
          data-active={authMode === 'login'}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 data-[active=true]:border-indigo-600 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700"
          data-active={authMode === 'register'}
        >
          Register
        </button>
      </div>

      <form className="grid gap-3">
        <label className="grid gap-1 text-sm text-slate-700">
          Username
          <input
            type="text"
            placeholder="e.g. ali"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Password
          <input
            type="password"
            placeholder="******"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
          />
        </label>

        <button
          type="button"
          className="mt-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
        >
          {authMode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </SectionCard>
  )
}
