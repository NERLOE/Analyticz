import { createRouter } from "./context";
import { z } from "zod";
import { getSession } from "next-auth/react";

export const authRouter = createRouter().query("getSession", {
  async resolve({ ctx }) {
    const session = await getSession();

    return session;
  },
});
