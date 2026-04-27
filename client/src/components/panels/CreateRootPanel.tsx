import { useState } from 'react'
import { toast } from 'react-toastify'
import { useCreateRootMutation } from '../../react-query/use-posts-query'
import { SectionCard } from '../ui/SectionCard'
import { getActionErrorMessage } from '../../utils/get-action-error-message'

export const CreateRootPanel = () => {
  const [value, setValue] = useState('42')
  const createRootMutation = useCreateRootMutation()

  const onCreateRoot = async () => {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) {
      toast.error('Please enter a valid starting number.')
      return
    }
    try {
      await createRootMutation.mutateAsync({ value: numericValue })
      toast.success('Your discussion was posted.')
    } catch (err) {
      toast.error(getActionErrorMessage(err, 'createDiscussion'))
    }
  }

  return (
    <SectionCard
      title='Start a New Discussion'
      description='Post the first number so others can reply with their operations.'
    >
      <form className='grid gap-3'>
        <label className='grid gap-1 text-sm text-slate-700'>
          Starting Number
          <input
            type='number'
            placeholder='e.g. 42'
            value={value}
            onChange={event => setValue(event.target.value)}
            className='rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2'
          />
        </label>
        <button
          type='button'
          onClick={onCreateRoot}
          disabled={createRootMutation.isPending}
          className='cursor-pointer rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
        >
          {createRootMutation.isPending ? 'Posting...' : 'Post Discussion'}
        </button>
      </form>
    </SectionCard>
  )
}
