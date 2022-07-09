import { createRouter } from "./context";
import { z } from "zod";
import { getWebsiteData } from "@utils/website-data";
import { TRPCError } from "@trpc/server";

export const sitesRouter = createRouter()
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
  .query("getWebsite", {
    input: z.object({
      domain: z.string(),
    }),
    async resolve({ ctx, input }) {
      const website = await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return website;
    },
  })
  .query("getVisits", {
    input: z.object({
      domain: z.string(),
    }),
    async resolve({ ctx, input }) {
      const website = await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access to this site.",
        });
      }

      console.log(website);

      return await ctx.prisma.visit.groupBy({
        by: ["path", "origin"],
        _count: {
          id: true,
        },
        where: { websiteId: website.id },
        orderBy: {
          // Prisma can only order by one column
          _count: { id: "desc" },
        },
      });
    },
  })
  .query("getSources", {
    input: z.object({
      domain: z.string(),
    }),
    async resolve({ ctx, input }) {
      const website = await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access to this site.",
        });
      }

      console.log(website);

      const sources = await ctx.prisma.visit.findMany({
        distinct: ["referrerId"],
        include: {
          referrer: true,
        },
        where: { websiteId: website.id },
      });

      return sources.map((source) => {
        console.log(source);
        return {
          title: source.referrer ? source.referrer.title : "None / Direct",
          link: source.referrer ? source.referrer.domain : null,
          icon: source.referrer ? source.referrer.icon : null,
          value: 1,
        };
      });
    },
  });
