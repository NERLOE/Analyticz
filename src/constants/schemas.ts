import { z } from "zod";

export const CreateSiteSchema = z.object({
  domain: z
    .string()
    .regex(
      /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/,
      "Domain must be valid"
    ),
});
