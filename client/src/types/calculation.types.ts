export type OperationType = 'add' | 'sub' | 'mul' | 'div'

export interface CalculationNode {
  id: string
  value: number
  parentId: string | null
  operation: OperationType | null
  right: number | null
  userId: string
  createdAt: string
  children: CalculationNode[]
}
