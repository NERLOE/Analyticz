import { getProviders } from "next-auth/react";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";

export const authRouter = createRouter()
  .query("getSession", {
    async resolve({ ctx }) {
      console.log("Getting session");
      return ctx.session;
    },
  })
  .query("getProviders", {
    async resolve({ ctx }) {
      const providers = await getProviders();
      return providers;
    },
  })
  .middleware(async ({ ctx, next }) => {
    /**
     * Any queries or mutations after this middleware will
     * raise an error unless there is a current session
     */
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .query("getWebsites", {
    async resolve({ ctx }) {
      let lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const websites = await ctx.prisma.website.findMany({
        where: { ownerId: ctx?.session?.user.id },
        include: {
          visits: {
            distinct: ["visitorId"],
            where: {
              visitedAt: {
                gte: lastDay,
              },
            },
          },
        },
      });

      return websites;
    },
  });
