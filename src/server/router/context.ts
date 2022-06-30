// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const { req, res } = opts;
  const session = opts && (await getServerSession(req, res, authOptions));

  return {
    req,
    res,
    prisma,
    session,
  };
};

export const createRouter = () => trpc.router<Context>();

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
