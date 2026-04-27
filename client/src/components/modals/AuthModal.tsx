import { AuthPanel } from '../panels/AuthPanel'
import { useUiStore } from '../../store/ui.store'

export const AuthModal = () => {
  const isAuthModalOpen = useUiStore(state => state.isAuthModalOpen)
  const closeAuthModal = useUiStore(state => state.closeAuthModal)

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 modal-overlay-enter">
      <div className="w-full max-w-md modal-panel-enter">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={closeAuthModal}
            className="cursor-pointer rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700"
          >
            Close
          </button>
        </div>
        <AuthPanel />
      </div>
    </div>
  )
}
