import { PrismaClient } from "@prisma/client";

const dbClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

export default dbClient