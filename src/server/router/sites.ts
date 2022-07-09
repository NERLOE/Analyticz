import { createRouter } from "./context";
import { z } from "zod";
import { getWebsiteData, shouldBeUpdated } from "@utils/website-data";
import { TRPCError } from "@trpc/server";
import { getDevice } from "@utils/request-information";
import { StatsCardData } from "@components/StatsCard/StatsCard";

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

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

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

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access to this site.",
        });
      }

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

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access to this site.",
        });
      }

      const sources = await ctx.prisma.visit.findMany({
        distinct: ["referrerId"],
        include: {
          referrer: true,
        },
        where: { websiteId: website.id },
      });

      return (
        await Promise.all(
          sources.map(async (source) => {
            let referrer = source.referrer;
            if (referrer) {
              if (shouldBeUpdated(referrer.updatedAt)) {
                const websiteData = await getWebsiteData(referrer.domain);

                if (websiteData) {
                  referrer = await ctx.prisma.referrer.update({
                    where: { id: referrer.id },
                    data: {
                      updatedAt: new Date(),
                      icon: websiteData.icon,
                      title: websiteData.title,
                    },
                  });
                }
              }
            }

            const visitors = await ctx.prisma.visit.findMany({
              distinct: ["visitorId"],
              include: {
                referrer: true,
              },
              where: { websiteId: website.id, referrerId: source.referrerId },
            });

            return {
              title: referrer
                ? `${referrer.title} (${referrer.domain.split("//")[1]})`
                : "None / Direct",
              link: referrer ? referrer.domain : undefined,
              icon: referrer ? referrer.icon : null,
              value: visitors.length,
            };
          })
        )
      ).sort((a, b) => (a.value > b.value ? -1 : 1));
    },
  })
  .query("getCountries", {
    input: z.object({
      domain: z.string(),
    }),
    async resolve({ ctx, input }) {
      const website = await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access to this site.",
        });
      }

      const countries = await ctx.prisma.visit.findMany({
        distinct: ["country"],
        where: { websiteId: website.id },
      });

      return (
        await Promise.all(
          countries
            .filter((x) => x.country !== null)
            .map(async (country) => {
              const visitors = await ctx.prisma.visit.findMany({
                distinct: ["visitorId"],
                include: {
                  referrer: true,
                },
                where: { websiteId: website.id, country: country.country },
              });

              return {
                title: country.country as string,
                link: undefined,
                icon: country.country as string,
                value: visitors.length,
              };
            })
        )
      ).sort((a, b) => (a.value > b.value ? -1 : 1));
    },
  })
  .query("getDevices", {
    input: z.object({
      domain: z.string(),
    }),
    async resolve({ ctx, input }) {
      const website = await ctx.prisma.website.findUnique({
        where: { domain: input.domain },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      if (website.ownerId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access to this site.",
        });
      }

      const visits = await ctx.prisma.visit.findMany({
        distinct: ["screenWidth"],
        where: { websiteId: website.id },
      });

      const devices: StatsCardData[] = [];

      await Promise.all(
        visits
          .filter((x) => x.screenWidth !== null)
          .map(async (visit) => {
            const visitors = await ctx.prisma.visit.findMany({
              distinct: ["visitorId"],
              include: {
                referrer: true,
              },
              where: { websiteId: website.id, screenWidth: visit.screenWidth },
            });

            const device = getDevice(visit.screenWidth as number);
            const existIndex = devices.findIndex((x) => x.title == device.name);
            const exist = devices[existIndex];
            if (exist) {
              devices[existIndex] = {
                ...exist,
                value: exist.value + visitors.length,
              };
            } else {
              devices.push({
                title: device.name,
                link: undefined,
                icon: device.name,
                value: visitors.length,
              });
            }
          })
      );

      return devices.sort((a, b) => (a.value > b.value ? -1 : 1));
    },
  });
