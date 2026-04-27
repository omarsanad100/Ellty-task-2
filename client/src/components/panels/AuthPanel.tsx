import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthSubmit } from '../../hooks/use-auth-submit'
import { useUiStore } from '../../store/ui.store'
import { SectionCard } from '../ui/SectionCard'

export const AuthPanel = () => {
  const authMode = useUiStore(state => state.authMode)
  const setAuthMode = useUiStore(state => state.setAuthMode)
  const closeAuthModal = useUiStore(state => state.closeAuthModal)
  const { submit, isPending } = useAuthSubmit()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isSubmitDisabled =
    isPending || username.trim() === '' || password.trim() === ''

  const onSubmit = async () => {
    try {
      await submit({
        username: username.trim(),
        password
      })
      setPassword('')
      closeAuthModal()
    } catch (err) {
      const message =
        err instanceof Error && err.message.trim() !== ''
          ? err.message
          : 'Authentication failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <SectionCard
      title='Welcome to the Community'
      description='Sign in or create an account to post and reply in number discussions.'
    >
      <div className='mb-4 flex gap-2'>
        <button
          type='button'
          onClick={() => setAuthMode('login')}
          className='cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 data-[active=true]:border-slate-900 data-[active=true]:bg-slate-900 data-[active=true]:text-white'
          data-active={authMode === 'login'}
        >
          Sign In
        </button>
        <button
          type='button'
          onClick={() => setAuthMode('register')}
          className='cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 data-[active=true]:border-slate-900 data-[active=true]:bg-slate-900 data-[active=true]:text-white'
          data-active={authMode === 'register'}
        >
          Create Account
        </button>
      </div>

      <form className='grid gap-3'>
        <label className='grid gap-1 text-sm text-slate-700'>
          Community Name
          <input
            type='text'
            placeholder='e.g. ali'
            value={username}
            onChange={event => setUsername(event.target.value)}
            className='rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2'
          />
        </label>

        <label className='grid gap-1 text-sm text-slate-700'>
          Password
          <input
            type='password'
            placeholder='******'
            value={password}
            onChange={event => setPassword(event.target.value)}
            className='rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2'
          />
        </label>

        <button
          type='button'
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className='mt-1 cursor-pointer rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isPending
            ? 'Please wait...'
            : authMode === 'login'
            ? 'Sign In'
            : 'Create Account'}
        </button>
      </form>
    </SectionCard>
  )
}
