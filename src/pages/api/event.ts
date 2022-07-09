import { getIpFromRequest } from "./../../utils/request-information";
// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";
import z from "zod";
import { LogEvents } from "@constants/events";
import { getWebsiteData, shouldBeUpdated } from "@utils/website-data";
import platform from "platform";
import NextCors from "nextjs-cors";
import geolite2 from "geolite2";
import maxmind, { CityResponse, CountryResponse } from "maxmind";
import { x64 } from "murmurhash3js";
import { getVisitorId } from "@utils/visitor";
import isbot from "isbot";

const schema = z.object({
  d: z.string(), // Domain
  e: z.enum(LogEvents), // Event name
  r: z.string().url().nullable().optional(), // Referrer
  u: z.string().url(), // URL
  w: z.number().optional(), // Window width
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(400).send({ error: "Method not allowed" });

  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    const data = schema.parse(JSON.parse(req.body));
    const ip = getIpFromRequest(req);
    const lookup = await maxmind.open(geolite2.paths.city);
    const geo = lookup.get(ip) as (CityResponse & CountryResponse) | null;

    const userAgent = req.headers["user-agent"];
    if (!userAgent) {
      return res
        .status(200)
        .json({ success: false, msg: "User agent not found" });
    }

    if (isbot(userAgent)) {
      console.log(
        `A bot has been detected, ignoring event. ua: ${userAgent}, ip: ${ip}`
      );
      return res.status(200).json({ success: false, msg: "Bot detected" });
    }

    const { name: browser, os } = platform.parse(userAgent);

    const website = await prisma.website.findUnique({
      where: {
        domain: data.d,
      },
    });

    if (!website)
      return res
        .status(200)
        .json({ success: false, msg: "Website not tracked" });

    let ref = undefined;
    if (data.r) {
      const refUrl = new URL(data.r).origin;
      const refFound = await prisma.referrer.findUnique({
        where: { domain: refUrl },
      });

      if (refFound) {
        if (shouldBeUpdated(refFound.updatedAt)) {
          const websiteData = await getWebsiteData(refUrl);

          if (websiteData) {
            await prisma.referrer.update({
              where: { id: refFound.id },
              data: {
                updatedAt: new Date(),
                icon: websiteData.icon,
                title: websiteData.title,
              },
            });
          }
        }

        ref = refFound;
      } else {
        const websiteData = await getWebsiteData(refUrl);

        if (websiteData) {
          ref = await prisma.referrer.create({
            data: {
              domain: refUrl,
              icon: websiteData.icon,
              title: websiteData.title,
            },
          });
        }
      }
    }

    const url = new URL(data.u);
    const visitorId = getVisitorId(userAgent, ip);

    const screenWidth = data.w;

    if (data.e == "pageView") {
      await prisma.visit.create({
        data: {
          url: data.u,
          path: url.pathname,
          origin: url.origin,
          websiteId: website.id,
          referrerId: ref?.id,
          os: os?.family,
          browser,
          city: geo?.city?.names?.en,
          country: geo?.country?.names?.en,
          ip,
          visitorId,
          screenWidth,
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json(err);
  }
};
