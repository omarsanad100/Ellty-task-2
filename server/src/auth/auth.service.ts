// modules/auth/auth.service.ts
import { prisma } from '../config/db.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { signToken } from '../utils/jwt.js'

export const register = async (username: string, password: string) => {
  const hashed = await hashPassword(password)

  return prisma.user.create({
    data: { username, password: hashed }
  })
}

export const login = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) throw new Error('User not found')

  const valid = await comparePassword(password, user.password)

  if (!valid) throw new Error('Invalid credentials')

  const token = signToken({ userId: user.id })

  return { token }
}
