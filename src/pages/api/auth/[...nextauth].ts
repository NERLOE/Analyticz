import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@server/db/client";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
      version: "2.0",
    }),
    // ...add more providers here
  ],
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("LINK ACCOUNT", user, account, profile);
    },
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user = user as User;
      return session;
    },
    async signIn({ account, profile }) {
      const user = await prisma.user.findUnique({
        where: { email: profile.email },
      });
      if (!user) return true;
      console.log("signing in", user, account, profile);

      const acc = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: account.provider,
        },
      });

      if (acc) {
        return true;
      } else {
        console.log("data", { ...account, userId: user.id });
        await prisma.account.create({ data: { ...account, userId: user.id } });

        return true;
      }
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
