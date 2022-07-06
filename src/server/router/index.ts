// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { sitesRouter } from "./sites";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("sites.", sitesRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
