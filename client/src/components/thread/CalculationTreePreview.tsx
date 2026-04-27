import type { ReactElement } from 'react'
import type { CalculationNode } from '../../types/calculation.types'
import { SectionCard } from '../ui/SectionCard'

interface Props {
  roots: CalculationNode[]
  isLoading: boolean
}

const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const symbolForOperation = (operation: CalculationNode['operation']): string => {
  if (operation === 'add') return '+'
  if (operation === 'sub') return '-'
  if (operation === 'mul') return '×'
  if (operation === 'div') return '÷'
  return ''
}

const renderTreeNode = (
  node: CalculationNode,
  index: number,
  depth: number
): ReactElement => {
  const label = depth === 0 ? `Discussion #${index + 1}` : `Reply #${index + 1}`
  const operationSummary =
    node.operation && node.right != null
      ? `Used ${symbolForOperation(node.operation)} ${node.right}`
      : 'Started the discussion'

  return (
    <li key={node.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
          {label}
        </span>
        <span className="text-xs text-slate-500">{formatDate(node.createdAt)}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">Current number: {node.value}</p>
      <p className="text-sm text-slate-600">{operationSummary}</p>

      {node.children.length > 0 ? (
        <ul className="mt-3 grid gap-2 border-l-2 border-slate-200 pl-3">
          {node.children.map((child, childIndex) =>
            renderTreeNode(child, childIndex, depth + 1)
          )}
        </ul>
      ) : null}
    </li>
  )
}

export const CalculationTreePreview = ({ roots, isLoading }: Props) => {
  return (
    <SectionCard
      title="Community Discussion Thread"
      description="Live conversation tree from the backend."
    >
      <div className="max-h-[24rem] overflow-y-auto pr-1">
        {isLoading ? <p className="text-sm text-slate-500">Loading discussions...</p> : null}
        {!isLoading && roots.length === 0 ? (
          <p className="text-sm text-slate-500">No discussions yet. Start one with your first number.</p>
        ) : null}
        {roots.length > 0 ? (
          <ul className="grid gap-3">
            {roots.map((root, rootIndex) => renderTreeNode(root, rootIndex, 0))}
          </ul>
        ) : null}
      </div>
    </SectionCard>
  )
}
