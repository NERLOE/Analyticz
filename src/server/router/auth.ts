import { createRouter } from "./context";
import { z } from "zod";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

export const authRouter = createRouter().query("getSession", {
  async resolve({ ctx }) {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions
    );

    return session;
  },
});
