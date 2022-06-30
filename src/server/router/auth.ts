import { createRouter } from "./context";
import { getSession } from "next-auth/react";

export const authRouter = createRouter().query("getSession", {
  async resolve({ ctx }) {
    const session = await getSession({ req: ctx.req });

    return session;
  },
});
