import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_PRISMA_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.DATABASE_PRISMA_DATABASE_URL = process.env.DATABASE_URL;
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
