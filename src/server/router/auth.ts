import { getProviders } from "next-auth/react";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { Session } from "next-auth";
import { prisma } from "@server/db/client";
import { getWebsiteData } from "@utils/website-data";
import { z } from "zod";
import { CreateSiteSchema } from "@constants/schemas";

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
      return getUserWebsites(ctx.session);
    },
  })
  .mutation("createSite", {
    input: CreateSiteSchema,
    async resolve({ input, ctx }) {
      const exists = await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Domain already exists",
        });
      }

      const websiteData = await getWebsiteData(`https://${input.domain}`);
      const userId = ctx.session?.user.id as string;

      return await ctx.prisma.website.create({
        data: {
          domain: input.domain,
          ownerId: userId,
          icon: websiteData?.icon,
        },
      });
    },
  });

export const getUserWebsites = async (session?: Session | null) => {
  let lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  return await prisma.website.findMany({
    where: { ownerId: session?.user.id },
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
};
