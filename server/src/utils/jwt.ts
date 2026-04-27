import jwt from 'jsonwebtoken'

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (secret == null || secret === '') {
    throw new Error('JWT_SECRET is missing or empty. Set it in .env and restart the server.')
  }
  return secret.trim()
}

export const signToken = (payload: object) =>
  jwt.sign(payload, getSecret(), { expiresIn: '7d' })

export const verifyToken = (token: string) => jwt.verify(token, getSecret())
