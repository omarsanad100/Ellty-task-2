import { httpClient } from './http-client'
import type { CalculationNode, OperationType } from '../types/calculation.types'

export interface CreateRootPayload {
  value: number
}

export interface CreateOperationPayload {
  parentId: string
  operation: OperationType
  right: number
}

export const getTreeApi = async (): Promise<CalculationNode[]> => {
  const { data } = await httpClient.get<CalculationNode[]>('/posts')
  return data
}

export const createRootApi = async (
  payload: CreateRootPayload
): Promise<CalculationNode> => {
  const { data } = await httpClient.post<CalculationNode>('/posts/root', payload)
  return data
}

export const createOperationApi = async (
  payload: CreateOperationPayload
): Promise<CalculationNode> => {
  const { data } = await httpClient.post<CalculationNode>('/posts/operation', payload)
  return data
}
