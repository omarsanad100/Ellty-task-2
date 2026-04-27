// modules/auth/auth.controller.ts
import type { Request, Response, NextFunction } from 'express'
import * as service from './auth.service.js'
import { registerSchema, loginSchema } from './auth.validation.js'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body)
    const user = await service.register(data.username, data.password)
    res.json(user)
  } catch (e) {
    next(e)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await service.login(data.username, data.password)
    res.json(result)
  } catch (e) {
    next(e)
  }
}
