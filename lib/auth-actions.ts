"use server"

import { signIn } from "@/lib/auth"
import { loginSchema } from "./zod"
import { AuthError } from "next-auth"


export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
}

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // Validate form fields
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // If validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // If validation passes, attempt to sign in
  try {
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
      
    })
    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password",
          }
        default:
          return {
            message: "Something went wrong",
          }
      }
    }
    throw error
  }

}
