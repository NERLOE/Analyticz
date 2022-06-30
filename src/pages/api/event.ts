import { getIpFromRequest } from "./../../utils/request-information";
// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";
import z from "zod";
import { LogEvents } from "@constants/events";
import { getWebsiteData } from "@utils/website-data";
import platform from "platform";
import NextCors from "nextjs-cors";

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

    const { name: browser, os } = platform.parse(req.headers["user-agent"]);

    const website = await prisma.website.findUnique({
      where: {
        domain: data.d,
      },
    });

    console.log("website", website);

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
        if (Date.now() - refFound.updatedAt.getTime() > 1000 * 60 * 10) {
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

    if (data.e) {
    }
    await prisma.visit.create({
      data: {
        url: data.u,
        path: url.pathname,
        websiteId: website.id,
        referrerId: ref?.id,
        os: os?.family,
        browser,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json(err);
  }
};
