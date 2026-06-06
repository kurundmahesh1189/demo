import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.email) {
        const user = await prisma.user.upsert({
          where: { email: profile.email },
          update: { name: profile.name as string, image: (profile as Record<string, string>).picture },
          create: {
            email: profile.email,
            name: profile.name as string,
            image: (profile as Record<string, string>).picture,
          },
        });
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.image) session.user.image = token.image as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
