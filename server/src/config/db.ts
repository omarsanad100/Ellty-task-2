import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error']
})

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('DB Connected via prisma')
  } catch (error) {
    if (error instanceof Error) {
      console.error(`database connection error ${error.message}`)
    } else {
      console.error('unknown error', error)
    }
  }
}

const disconnectDB = async () => {
  await prisma.$disconnect()
  await pool.end()
}

export { prisma, connectDB, disconnectDB }
