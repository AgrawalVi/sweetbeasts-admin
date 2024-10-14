import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { db } from '@/lib/db'

export const orderRouter = createTRPCRouter({
  getAllOrders: publicProcedure.query(async () => {
    return await db.order.findMany()
  }),
})
