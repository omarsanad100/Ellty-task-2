import { PrismaClient } from '@prisma/client/extension'

const prisma = new PrismaClient({
  adapter: {
    url: process.env.DATABASE_URL!
  },
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
}

export { prisma, connectDB, disconnectDB }
