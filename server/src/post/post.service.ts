// modules/post/post.service.ts
import { prisma } from '../config/db.js'

type PostNode = {
  id: string
  value: number
  operation: string | null
  right: number | null
  parentId: string | null
  userId: string
  createdAt: Date
  children: PostNode[]
}

export const createRoot = (userId: string, value: number) => {
  return prisma.post.create({
    data: { value, userId }
  })
}

export const addOperation = async (
  userId: string,
  parentId: string,
  operation: string,
  right: number
) => {
  const parent = await prisma.post.findUnique({ where: { id: parentId } })
  if (!parent) throw new Error('Parent not found')

  let result = parent.value

  if (operation === 'add') result += right
  if (operation === 'sub') result -= right
  if (operation === 'mul') result *= right
  if (operation === 'div') result /= right

  return prisma.post.create({
    data: {
      value: result,
      parentId,
      operation,
      right,
      userId
    }
  })
}

export const getTree = async () => {
  const posts = await prisma.post.findMany()

  const map = new Map<string, PostNode>()

  // create nodes
  posts.forEach(post => {
    map.set(post.id, {
      ...post,
      children: []
    })
  })

  const roots: PostNode[] = []

  // build tree
  map.forEach(node => {
    if (node.parentId) {
      const parent = map.get(node.parentId)
      parent?.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}
