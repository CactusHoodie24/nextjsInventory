
"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginAction, type LoginState } from "@/lib/auth-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
export default function RegisterComponent() {
      const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {})
         const router = useRouter()

    // Handle successful login
  useEffect(() => {
    if (state.success) {
      // Force a full page reload to ensure all client components get the updated session
      window.location.href = "/dashboard"
      // Alternative: Use router.push with a reload
      // router.push("/dashboard")
      // window.location.reload()
    }
  }, [state.success, router])
 return (
   <Card className="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state.errors?.password && <p className="text-sm text-red-600">{state.errors.password[0]}</p>}
          </div>

          {state.message && <p className="text-sm text-red-600">{state.message}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
          {state.success && <h2 className=" text-sm text-red-600">Login was a success</h2>}
        </form>
      </CardContent>
    </Card>
 )
}