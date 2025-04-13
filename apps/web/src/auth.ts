import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import config from "./lib/config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Ensures NextAuth works with remote hosts
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials

        const response = await fetch(`${config.env.baseUrl}/auth/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        if (!response.ok) {
          return null
        }

        const data = await response.json()

        return {
          accessToken: data.user.accessToken,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          image: data.user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.image = user.image
      } else {
      }
      return token
    },
    async session({ session, token }) {
      Object.assign(session, {
        id: token.id,
        accessToken: token.accessToken,
        name: token.name,
        email: token.email,
        role: token.role,
        image: token.image,
      })
      return session
    },
  },
  session: {
    strategy: "jwt", // Use JWT for session handling
    maxAge: 30 * 60, // 30 minutes in seconds
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes in seconds
  },
})
