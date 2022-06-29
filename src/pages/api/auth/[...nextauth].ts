import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@server/db/client";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        return null;
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  cookies: {},
});
