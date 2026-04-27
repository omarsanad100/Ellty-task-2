import { useUiStore } from '../../store/ui.store'

export const NavBar = () => {
  const token = useUiStore(state => state.token)
  const user = useUiStore(state => state.user)
  const openAuthModal = useUiStore(state => state.openAuthModal)
  const logout = useUiStore(state => state.logout)

  return (
    <nav className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white">
          N
        </div>
        <span className="text-sm font-semibold text-slate-900">Number Community</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
        >
          Home
        </button>
        {token ? (
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer rounded-md bg-slate-900 px-2 py-1.5 text-xs font-medium text-white sm:px-3 sm:text-sm"
          >
            Logout{user ? ` (${user.username})` : ''}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="cursor-pointer rounded-md bg-slate-900 px-2 py-1.5 text-xs font-medium text-white sm:px-3 sm:text-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  )
}
