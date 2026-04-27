import { useMemo } from 'react'
import type { CalculationNode } from '../types/calculation.types'

interface NodeOption {
  id: string
  label: string
}

const collectNodes = (nodes: CalculationNode[], out: NodeOption[]) => {
  for (const node of nodes) {
    out.push({
      id: node.id,
      label: `#${node.id.slice(0, 8)} · current number: ${node.value}`
    })
    if (node.children.length > 0) {
      collectNodes(node.children, out)
    }
  }
}

export const useTreeNodeOptions = (tree: CalculationNode[]): NodeOption[] => {
  return useMemo(() => {
    const out: NodeOption[] = []
    collectNodes(tree, out)
    return out
  }, [tree])
}
