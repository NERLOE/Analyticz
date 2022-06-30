import { createRouter } from "./context";

export const authRouter = createRouter().query("getSession", {
  async resolve({ ctx }) {
    return ctx.session;
  },
});
