import NextAuth, { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import authConfig from '@/auth.config'

import { getUserById } from '@/data/auth/user'
import { getTwoFactorConfirmationByUserId } from '@/data/auth/two-factor-confirmation'

declare module 'next-auth' {
  /**
   * Add any extra fields to the session that are not part of the default session
   */
  interface Session {
    user: {
      role: UserRole
      isTwoFactorEnabled: boolean
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
    isTwoFactorEnabled: boolean
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      // allow 0Auth without email verification
      if (account?.provider !== 'credentials') {
        return true
      }

      const existingUser = await getUserById(user.id)

      // Prevent sign-in without email verification
      if (!existingUser?.emailVerified) {
        return false
      }

      // if (existingUser.role !== "ADMIN") {
      //   return false
      // }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        )

        if (!twoFactorConfirmation) {
          return false
        }

        // Delete two factor conformation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
    async session({ token, session, user }) {
      console.log({ sessionToken: token })

      if (token.role && session.user) {
        session.user.role = token.role
      }

      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return null // Sub field in token stores the ID of the user

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
