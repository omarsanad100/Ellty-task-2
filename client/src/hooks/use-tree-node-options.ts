import { useMemo } from 'react'
import type { CalculationNode } from '../types/calculation.types'

interface NodeOption {
  id: string
  label: string
}

const collectNodes = (nodes: CalculationNode[], out: NodeOption[]) => {
  for (const node of nodes) {
    const id = node?.id
    if (typeof id !== 'string' || id.length === 0) continue

    const shortId = id.slice(0, 8)

    const rawValue = node?.value
    const valueLabel =
      typeof rawValue === 'number' && Number.isFinite(rawValue)
        ? String(rawValue)
        : '?'

    out.push({
      id,
      label: `#${shortId} · current number: ${valueLabel}`
    })

    const children = node?.children ?? []
    if (children.length > 0) collectNodes(children, out)
  }
}

export const useTreeNodeOptions = (tree: CalculationNode[]): NodeOption[] => {
  return useMemo(() => {
    const out: NodeOption[] = []
    const roots = Array.isArray(tree) ? tree : []
    collectNodes(roots, out)
    return out
  }, [tree])
}
