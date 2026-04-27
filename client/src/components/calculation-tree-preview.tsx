import type { ReactElement } from 'react'
import type { CalculationNode } from '../types/calculation.types'
import { SectionCard } from './section-card'

interface Props {
  roots: CalculationNode[]
}

const renderTreeNode = (node: CalculationNode): ReactElement => {
  return (
    <li key={node.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="rounded bg-white px-2 py-0.5 font-mono text-xs text-slate-700">
          {node.id.slice(0, 8)}
        </span>
        <span className="font-semibold text-slate-900">Value: {node.value}</span>
        <span className="text-slate-500">
          {node.operation ? `op: ${node.operation} ${node.right}` : 'root'}
        </span>
      </div>

      {node.children.length > 0 ? (
        <ul className="mt-3 grid gap-2 border-l-2 border-slate-200 pl-3">
          {node.children.map(renderTreeNode)}
        </ul>
      ) : null}
    </li>
  )
}

export const CalculationTreePreview = ({ roots }: Props) => {
  return (
    <SectionCard
      title="Calculation Tree Preview"
      description="Static sample rendering of nested nodes."
    >
      <ul className="grid gap-3">
        {roots.map(renderTreeNode)}
      </ul>
    </SectionCard>
  )
}
