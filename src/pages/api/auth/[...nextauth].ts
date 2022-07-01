import { signIn } from "next-auth/react";
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
    GoogleProvider({ clientId: "", clientSecret: "" }),
    TwitterProvider({ clientId: "", clientSecret: "", version: "2.0" }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = user as User;
      return session;
    },
  },
  logger: {
    warn: (message) => {
      return;
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
