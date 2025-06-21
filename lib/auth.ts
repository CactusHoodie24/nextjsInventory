  import NextAuth from "next-auth"
  import { PrismaAdapter } from "@auth/prisma-adapter"
  import { prisma } from "@/prisma"
  import Google from "next-auth/providers/google"
  import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/zod"
import { ZodError } from "zod"
import bcrypt from "bcryptjs"
  
  export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google,
      Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
      } ,
      authorize: async (credentials) => {
    
   try {
    const { email, password } = await loginSchema.parseAsync(credentials)

    const user = await prisma.user.findUnique({
      where: { email },
    })

      if (!user?.password) {
            throw new Error("Please sign in with the method you used to create your account")
          }

      const isPasswordValid = await bcrypt.compare(password, user.password)

       if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

    return user
  } catch (err) {
    if (err instanceof ZodError) {
       const firstIssue = err.issues[0]?.message || "Invalid input"
      throw new Error(firstIssue)
    }

    throw new Error("Login failed")
  } 
      }
      })
    ],
    session: {
      strategy: "jwt", // Use JWT for sessions to avoid database calls on every request
    },
     callbacks: {
     async jwt({ token, user }) {
    if (user) {
      // Only store the role string in the token
      console.log("JWT user role:", user.role);

      token.role = user.role;
    }
    return token;
  },
  async session({ session, token }) {
    if (token && session.user) {
      // Only set the role string on the session
      console.log("Session token role:", token.role);
      session.user.role = token.role as string;
    }
    console.log("Session from auth():", session);
    return session;
  }
  },
  })

  // Helper function to get session (equivalent to getServerSession)
export async function getSession() {
  return await auth()
}

// Helper function to get current user
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

// Helper function to check user role
export async function hasRole(requiredRole: string) {
  const session = await auth()
  return session?.user?.role === requiredRole
}