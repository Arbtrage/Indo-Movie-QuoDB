import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient({
    transactionOptions: {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10000, 
        timeout: 20000, 
    },
});

export default prisma