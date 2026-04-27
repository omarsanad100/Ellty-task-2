import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { verifyToken } from '../utils/jwt.js'

const tokenPayloadSchema = z.object({
  userId: z.string()
})

/** Reads auth user set by `authMiddleware` without augmenting Express types. */
export function getAuthUserId(req: Request): string | undefined {
  if (!('user' in req)) return undefined
  const raw: unknown = Reflect.get(req, 'user')
  if (!raw || typeof raw !== 'object') return undefined
  if (!('userId' in raw)) return undefined
  const userId = Reflect.get(raw, 'userId')
  return typeof userId === 'string' ? userId : undefined
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization?.trim()

  if (!header) {
    return res.status(401).json({
      message: 'Missing Authorization header. Use: Authorization: Bearer <your-jwt>'
    })
  }

  const bearer = /^Bearer\s+(.+)$/i.exec(header)
  const token = bearer?.[1]?.trim()

  if (!token) {
    return res.status(401).json({
      message:
        'Invalid Authorization format. Expected exactly: Authorization: Bearer <jwt> (paste the token from POST /auth/login, no angle brackets).'
    })
  }

  try {
    const decoded = verifyToken(token)
    if (typeof decoded !== 'object' || decoded === null) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    const parsed = tokenPayloadSchema.safeParse(decoded)
    if (!parsed.success) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    Reflect.set(req, 'user', parsed.data)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
