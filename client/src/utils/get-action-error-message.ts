type ActionName =
  | 'login'
  | 'register'
  | 'createDiscussion'
  | 'replyDiscussion'
  | 'generic'

const actionFallback: Record<ActionName, string> = {
  login: 'Could not sign you in. Please check your details and try again.',
  register: 'Could not create your account right now. Please try again.',
  createDiscussion: 'Could not post your discussion. Please try again.',
  replyDiscussion: 'Could not post your reply. Please try again.',
  generic: 'Something went wrong. Please try again.'
}

const authRequiredByAction: Record<ActionName, string> = {
  login: 'Please sign in to continue.',
  register: 'Please create an account to continue.',
  createDiscussion: 'Please sign in first, then post your discussion.',
  replyDiscussion: 'Please sign in first, then post your reply.',
  generic: 'Please sign in first to continue.'
}

export const getActionErrorMessage = (
  err: unknown,
  action: ActionName = 'generic'
): string => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const maybeResponse = Reflect.get(err, 'response')
    if (typeof maybeResponse === 'object' && maybeResponse !== null && 'data' in maybeResponse) {
      const data = Reflect.get(maybeResponse, 'data')
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = Reflect.get(data, 'message')
        if (typeof message === 'string' && message.trim() !== '') {
          if (
            message.includes('Missing Authorization header') ||
            message.toLowerCase().includes('invalid token') ||
            message.toLowerCase().includes('unauthorized')
          ) {
            return authRequiredByAction[action]
          }
          return message
        }
      }
    }
  }
  if (err instanceof Error && err.message.trim() !== '') return err.message
  return actionFallback[action]
}
