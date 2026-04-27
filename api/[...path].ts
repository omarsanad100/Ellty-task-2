import type { IncomingMessage, ServerResponse } from 'node:http'

/** Vercel bundles this handler as CJS; `server/` is ESM (`"type":"module"`). Dynamic `import()` avoids ERR_REQUIRE_ESM. */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const raw = req.url ?? '/'
  if (raw === '/api' || raw.startsWith('/api/')) {
    const rest = raw === '/api' ? '/' : raw.slice('/api'.length) || '/'
    req.url = rest
  }

  const { default: app } = await import('../server/src/app.js')
  app(req, res)
}
