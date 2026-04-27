import type { Request, Response, NextFunction } from 'express'

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
    /^[A-Z][A-Z0-9_]+$/.test(err.code)
  ) {
    return err.code
  }
  return ''
}

/** Prisma + driver adapters often hide the real PG error under `cause`. */
function resolveClientMessage(err: unknown): string {
  if (!(err instanceof Error)) return 'Something went wrong'

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
  const msg = err instanceof Error ? err.message : ''
  const code =
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof err.code === 'string'
      ? err.code
      : ''

  if (code === 'P2002') return 409
  if (/not found|invalid credentials|unauthorized/i.test(msg)) return 401
  if (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    /P1001|P1008|P1017|connection|ECONNREFUSED|timeout/i.test(msg)
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
