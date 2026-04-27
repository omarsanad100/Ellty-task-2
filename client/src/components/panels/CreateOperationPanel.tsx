import { useState } from 'react'
import { toast } from 'react-toastify'
import { useCreateOperationMutation } from '../../react-query/use-posts-query'
import type { OperationType } from '../../types/calculation.types'
import { SectionCard } from '../ui/SectionCard'
import { getActionErrorMessage } from '../../utils/get-action-error-message'

interface Props {
  nodeOptions: Array<{ id: string; label: string }>
}

const isOperationType = (value: string): value is OperationType => {
  return (
    value === 'add' ||
    value === 'sub' ||
    value === 'mul' ||
    value === 'div'
  )
}

export const CreateOperationPanel = ({ nodeOptions }: Props) => {
  const [parentId, setParentId] = useState('')
  const [operation, setOperation] = useState<OperationType>('add')
  const [right, setRight] = useState('2')
  const createOperationMutation = useCreateOperationMutation()

  const onAddOperation = async () => {
    const rightValue = Number(right)
    if (!parentId) {
      toast.info('Choose a message you want to reply to first.')
      return
    }
    if (Number.isNaN(rightValue)) {
      toast.error('Please enter a valid number for your reply.')
      return
    }
    try {
      await createOperationMutation.mutateAsync({
        parentId,
        operation,
        right: rightValue
      })
      toast.success('Your reply was posted.')
    } catch (err) {
      toast.error(getActionErrorMessage(err, 'replyDiscussion'))
    }
  }

  return (
    <SectionCard
      title='Reply to a Discussion'
      description='Pick a message in the thread, choose what to do with its number, then add your number.'
    >
      <form className='grid gap-3'>
        <label className='grid gap-1 text-sm text-slate-700'>
          Reply To
          <select
            value={parentId}
            onChange={event => setParentId(event.target.value)}
            className='rounded-md border border-slate-300 px-3 py-1.5 outline-none ring-indigo-200 focus:ring-2'
          >
            <option value=''>Choose a message</option>
            {nodeOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className='grid gap-1 text-sm text-slate-700'>
          What Should Happen?
          <select
            value={operation}
            onChange={event => {
              const value = event.target.value
              if (isOperationType(value)) setOperation(value)
            }}
            className='rounded-md border border-slate-300 px-3 py-1.5 outline-none ring-indigo-200 focus:ring-2'
          >
            <option value='add'>Add to it (+)</option>
            <option value='sub'>Subtract from it (-)</option>
            <option value='mul'>Multiply it (x)</option>
            <option value='div'>Divide it (/)</option>
          </select>
        </label>
        <p className='-mt-2 text-xs text-slate-500'>
          Example: if current number is 44 and you choose "Add to it (+)" with 6, the new number becomes 50.
        </p>

        <label className='grid gap-1 text-sm text-slate-700'>
          Your Number
          <input
            type='number'
            placeholder='e.g. 2'
            value={right}
            onChange={event => setRight(event.target.value)}
            className='rounded-md border border-slate-300 px-3 py-1.5 outline-none ring-indigo-200 focus:ring-2'
          />
        </label>

        <button
          type='button'
          onClick={onAddOperation}
          disabled={
            createOperationMutation.isPending || (nodeOptions?.length ?? 0) === 0
          }
          className='cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
        >
          {createOperationMutation.isPending
            ? 'Posting reply...'
            : 'Post Reply'}
        </button>
      </form>
    </SectionCard>
  )
}
