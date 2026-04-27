import type { AuthPayload } from '../api/auth.api'
import { useUiStore } from '../store/ui.store'
import {
  useLoginMutation,
  useRegisterMutation
} from '../react-query/use-auth-mutations'
import { getActionErrorMessage } from '../utils/get-action-error-message'

export const useAuthSubmit = () => {
  const authMode = useUiStore(state => state.authMode)
  const setAuthSession = useUiStore(state => state.setAuthSession)
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

  const isPending = loginMutation.isPending || registerMutation.isPending

  const submit = async (payload: AuthPayload) => {
    try {
      const result =
        authMode === 'login'
          ? await loginMutation.mutateAsync(payload)
          : await registerMutation.mutateAsync(payload)

      const token = result?.token
      const user = result?.user
      if (
        typeof token !== 'string' ||
        typeof user?.id !== 'string' ||
        typeof user?.username !== 'string' ||
        typeof user?.createdAt !== 'string'
      ) {
        throw new Error('Invalid authentication response from the server.')
      }

      const displayName = user.username.trim() !== '' ? user.username.trim() : 'there'

      sessionStorage.setItem(
        'post_auth_toast',
        JSON.stringify({
          id: Date.now().toString(),
          type: 'success',
          message:
            authMode === 'login'
              ? `Welcome back, ${displayName}!`
              : `Welcome, ${displayName}! Your account is ready.`
        })
      )
      setAuthSession(token, user)
    } catch (err) {
      const message = getActionErrorMessage(
        err,
        authMode === 'login' ? 'login' : 'register'
      )
      throw new Error(message, { cause: err })
    }
  }

  return { submit, isPending }
}
