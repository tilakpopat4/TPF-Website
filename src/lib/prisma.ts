import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  process.env.DATABASE_URL = 'file:../../dev.db' // use relative path for dev environment
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
