// modules/auth/auth.service.ts
import { prisma } from '../config/db.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { signToken } from '../utils/jwt.js'

export const register = async (username: string, password: string) => {
  const hashed = await hashPassword(password)

  const user = await prisma.user.create({
    data: { username, password: hashed },
    select: { id: true, username: true, createdAt: true }
  })

  const token = signToken({ userId: user.id })

  return { token, user }
}

export const login = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) throw new Error('User not found')

  const valid = await comparePassword(password, user.password)

  if (!valid) throw new Error('Invalid credentials')

  const token = signToken({ userId: user.id })

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    }
  }
}
