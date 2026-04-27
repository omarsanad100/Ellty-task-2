// modules/post/post.controller.ts
import type { Request, Response, NextFunction } from 'express'
import { getAuthUserId } from '../middlewares/auth.middleware.js'
import * as service from './post.service.js'
import { createRootSchema, operationSchema } from './post.validation.js'

export const createRoot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createRootSchema.parse(req.body)
    const userId = getAuthUserId(req)
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const post = await service.createRoot(userId, data.value)
    res.json(post)
  } catch (e) {
    next(e)
  }
}

export const addOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = operationSchema.parse(req.body)
    const userId = getAuthUserId(req)
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const post = await service.addOperation(
      userId,
      data.parentId,
      data.operation,
      data.right
    )

    res.json(post)
  } catch (e) {
    next(e)
  }
}

export const getTree = async (_: Request, res: Response) => {
  const tree = await service.getTree()
  res.json(tree)
}
