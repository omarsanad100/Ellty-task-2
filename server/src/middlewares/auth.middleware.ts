import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { verifyToken } from '../utils/jwt.js'

const tokenPayloadSchema = z.object({
  userId: z.string()
})

function isWhitespaceChar(ch: string): boolean {
  return ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t' || ch === '\f' || ch === '\v'
}

function removeWhitespace(input: string): string {
  let out = ''
  for (const ch of input) {
    if (!isWhitespaceChar(ch)) out += ch
  }
  return out
}

function startsWithBearerPrefix(value: string): boolean {
  if (value.length < 6) return false
  if (value.slice(0, 6).toLowerCase() !== 'bearer') return false
  if (value.length === 6) return true
  const nextChar = value.at(6)
  return nextChar !== undefined && isWhitespaceChar(nextChar)
}

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
      message:
        'Missing Authorization header. Use: Authorization: Bearer <your-jwt>'
    })
  }

  const firstSpace = header.indexOf(' ')
  const scheme =
    firstSpace === -1 ? header.toLowerCase() : header.slice(0, firstSpace).toLowerCase()
  let token =
    firstSpace === -1 ? '' : header.slice(firstSpace + 1).trim()

  if (scheme !== 'bearer' || !token) {
    return res.status(401).json({
      message:
        'Invalid Authorization format. Expected exactly: Authorization: Bearer <jwt> (paste the token from POST /auth/login, no angle brackets).'
    })
  }

  if (token.charCodeAt(0) === 0xfeff) {
    token = token.slice(1)
  }
  if (token.startsWith('"') && token.endsWith('"') && token.length >= 2) {
    token = token.slice(1, -1).trim()
  }
  // Postman adds "Bearer"; pasting "Bearer eyJ…" yields "Bearer Bearer eyJ…"
  while (startsWithBearerPrefix(token)) {
    token = token.slice(6).trim()
  }
  if (token) {
    token = removeWhitespace(token).trim()
  }

  if (!token) {
    return res.status(401).json({
      message:
        'Invalid Authorization format. Expected exactly: Authorization: Bearer <jwt> (paste the token from POST /auth/login, no angle brackets).'
    })
  }

  try {
    const decoded = verifyToken(token)
    if (typeof decoded !== 'object' || decoded === null) {
      return res.status(401).json({
        message: 'Invalid token payload. Log in again and send the new token.'
      })
    }
    const parsed = tokenPayloadSchema.safeParse(decoded)
    if (!parsed.success) {
      return res.status(401).json({
        message:
          'Token is missing userId. Log in again and paste the full token from POST /auth/login.'
      })
    }
    Reflect.set(req, 'user', parsed.data)
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Token expired. Log in again with POST /auth/login.'
      })
    }
    if (err instanceof jwt.JsonWebTokenError) {
      const detail = err.message
      const lowered = detail.toLowerCase()
      const hint =
        lowered.includes('signature') && !lowered.includes('malformed')
          ? ' If you changed JWT_SECRET in .env, old tokens are invalid—log in again after restart.'
          : ''
      const postmanHint =
        detail.trim().toLowerCase() === 'invalid token' && !hint
          ? ' Often caused by "Bearer Bearer ..." (paste only the eyJ… string in Postman Auth → Bearer Token, not the word Bearer).'
          : ''
      return res.status(401).json({
        message: `JWT rejected: ${detail}.${hint}${postmanHint} Get a fresh token from POST /auth/login or /auth/register.`,
        detail
      })
    }
    if (err instanceof Error && err.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: err.message })
    }
    return res.status(401).json({ message: 'Invalid token' })
  }
}
