import { prisma } from "@/prisma"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signUpSchema } from "@/lib/zod"
import { ZodError } from "zod"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phonenumber, imageUrl } = body

    // Server-side validation using the same schema
    const validatedData = signUpSchema.parse({
      email,
      password,
      name,
      phonenumber,
    })

    if (!imageUrl) {
      return NextResponse.json({ message: "Profile image is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phonenumber: validatedData.phonenumber,
        image: imageUrl,
      },
    })

    // Don't return sensitive data
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
