import type { Request, Response, NextFunction } from 'express'

function isUpperAlphaNumOrUnderscore(value: string): boolean {
  if (value.length === 0) return false
  const first = value.charCodeAt(0)
  const firstIsUpper = first >= 65 && first <= 90
  if (!firstIsUpper) return false

  for (let i = 1; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    const isUpper = code >= 65 && code <= 90
    const isNumber = code >= 48 && code <= 57
    const isUnderscore = code === 95
    if (!isUpper && !isNumber && !isUnderscore) return false
  }
  return true
}

function messageIncludesAny(message: string, parts: string[]): boolean {
  const lowered = message.toLowerCase()
  return parts.some(part => lowered.includes(part))
}

function readPgDetails(value: unknown): string[] {
  const out: string[] = []
  if (typeof value !== 'object' || value === null) return out
  if (
    'originalMessage' in value &&
    typeof value.originalMessage === 'string' &&
    value.originalMessage.length > 0
  ) {
    out.push(value.originalMessage)
  }
  if (
    'message' in value &&
    typeof value.message === 'string' &&
    value.message.length > 0 &&
    !out.includes(value.message)
  ) {
    out.push(value.message)
  }
  if ('cause' in value) {
    out.push(...readPgDetails(value.cause))
  }
  return out
}

function getNodeErrorCode(err: unknown): string {
  if (typeof err !== 'object' || err === null) return ''
  if (
    'code' in err &&
    typeof err.code === 'string' &&
    isUpperAlphaNumOrUnderscore(err.code)
  ) {
    return err.code
  }
  return ''
}

function getBodyParserErrorType(err: unknown): string {
  if (typeof err !== 'object' || err === null) return ''
  if ('type' in err && typeof err.type === 'string') return err.type
  return ''
}

/** Prisma + driver adapters often hide the real PG error under `cause`. */
function resolveClientMessage(err: unknown): string {
  if (!(err instanceof Error)) return 'Something went wrong'

  const bodyParserType = getBodyParserErrorType(err)
  if (bodyParserType === 'entity.parse.failed') {
    return 'Invalid JSON body. Send valid JSON with Content-Type: application/json.'
  }

  const nodeCode = getNodeErrorCode(err)
  if (nodeCode === 'P2002') {
    return 'This username is already taken. Choose a different username or sign in.'
  }
  if (nodeCode === 'ECONNREFUSED') {
    return (
      'Database connection refused. Nothing is accepting connections at DATABASE_URL (wrong host/port, ' +
      'local Postgres not running, or Neon project paused). Fix DATABASE_URL and ensure the DB is up.'
    )
  }
  if (nodeCode === 'ETIMEDOUT' || nodeCode === 'ENOTFOUND') {
    return `Database unreachable (${nodeCode}). Check DATABASE_URL, DNS, and firewall.`
  }

  const parts: string[] = [err.message]
  let cursor: unknown = err.cause
  let depth = 0
  while (cursor != null && depth < 6) {
    if (cursor instanceof Error) {
      parts.push(cursor.message)
      parts.push(...readPgDetails(cursor))
      cursor = cursor.cause
    } else {
      parts.push(...readPgDetails(cursor))
      cursor = null
    }
    depth += 1
  }

  const unique = [...new Set(parts.filter(Boolean))]
  return unique.join(' | ')
}

function statusForError(err: unknown): number {
  const bodyParserType = getBodyParserErrorType(err)
  const msg = err instanceof Error ? err.message : ''
  const code =
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof err.code === 'string'
      ? err.code
      : ''

  if (code === 'P2002') return 409
  if (bodyParserType === 'entity.parse.failed') return 400
  if (
    messageIncludesAny(msg, [
      'not found',
      'invalid credentials',
      'unauthorized'
    ])
  )
    return 401
  if (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    messageIncludesAny(msg, [
      'p1001',
      'p1008',
      'p1017',
      'connection',
      'econnrefused',
      'timeout'
    ])
  )
    return 503
  return 400
}

export const errorMiddleware = (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  const message = resolveClientMessage(err)
  if (process.env.NODE_ENV === 'development') {
    console.error('[error]', message, err)
  }
  res.status(statusForError(err)).json({ message })
}
