import { createRouter } from "./context";
import { z } from "zod";

export const analyticsRouter = createRouter()
  .query("getWebsite", {
    input: z.object({
      domain: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });
    },
  })
  .query("getVisits", {
    input: z.object({
      websiteId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.visit.groupBy({
        by: ["path", "origin"],
        _count: {
          id: true,
        },
        where: { websiteId: input.websiteId },
        orderBy: {
          // Prisma can only order by one column
          _count: { id: "desc" },
        },
      });
    },
  });
