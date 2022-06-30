// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { analyticsRouter } from "./analytics";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("analytics.", analyticsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
