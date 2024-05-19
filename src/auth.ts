import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import { getUserById } from "@/businessLogic/user"
import { db } from "@/lib/db"
import authConfig from "@/auth.config"

declare module "next-auth" {
  
  /**
   * Add any extra fields to the session that are not part of the default session
   */
  interface Session {
    user: {
      role: UserRole
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    }
  },

  callbacks: {
    // async signIn({ user })  {
    //   const existingUser = await getUserById(user.id)

    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false;
    //   }

    //   return true
    // },
    async session({ token, session, user }) {
      console.log({ sessionToken: token })

      if (token.role && session.user) {
        session.user.role = token.role
      }

      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return null // Sub field in token stores the ID of the user

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
