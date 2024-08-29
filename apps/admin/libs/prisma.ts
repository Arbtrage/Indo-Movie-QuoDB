import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient({
    transactionOptions: {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, 
        timeout: 10000, 
    },
});

export default prisma