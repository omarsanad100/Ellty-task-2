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

      sessionStorage.setItem(
        'post_auth_toast',
        JSON.stringify({
          id: Date.now().toString(),
          type: 'success',
          message:
            authMode === 'login'
              ? `Welcome back, ${result.user.username}!`
              : `Welcome, ${result.user.username}! Your account is ready.`
        })
      )
      setAuthSession(result.token, result.user)
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
