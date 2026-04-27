import { useEffect } from 'react'
import { toast } from 'react-toastify'

export const usePostAuthToast = () => {
  useEffect(() => {
    const raw = sessionStorage.getItem('post_auth_toast')
    if (!raw) return

    try {
      const parsed: unknown = JSON.parse(raw)
      if (typeof parsed !== 'object' || parsed === null) return

      const id = Reflect.get(parsed, 'id')
      const message = Reflect.get(parsed, 'message')
      if (typeof id !== 'string' || typeof message !== 'string') return

      const lastShownId = sessionStorage.getItem('post_auth_toast_last_shown_id')
      if (lastShownId === id) return

      sessionStorage.setItem('post_auth_toast_last_shown_id', id)
      window.setTimeout(() => {
        toast.success(message)
        sessionStorage.removeItem('post_auth_toast')
      }, 50)
    } catch {
      // ignore invalid storage value
    }
  }, [])
}
