"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signUpSchema, type SignUpFormData } from "@/lib/zod"
import { ZodError } from "zod"
import { toast } from "sonner"
import RegisterComponent from "./login"

interface ValidationErrors {
  email?: string
  password?: string
  name?: string
  phonenumber?: string
  image?: string
}

export default function ValidatedSignupFormWithToast() {
  const [formData, setFormData] = useState<SignUpFormData & { image?: string }>({
    email: "",
    password: "",
    name: "",
    phonenumber: "",
    image: "",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (field: keyof SignUpFormData, value: string) => {
    try {
      // Validate individual field
      const fieldSchema = signUpSchema.shape[field]
      fieldSchema.parse(value)

      // Clear error if validation passes
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0]?.message }))
      }
    }
  }

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validate field on change (debounced validation would be better for UX)
    if (value.length > 0) {
      validateField(field, value)
    }
  }

  const validateForm = (): boolean => {
    try {
      // Validate all form data
      signUpSchema.parse({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phonenumber: formData.phonenumber,
      })

      // Check if image is uploaded
      if (!formData.image) {
        setErrors((prev) => ({ ...prev, image: "Profile image is required" }))
        toast.error("Please upload a profile image")
        return false
      }

      setErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: ValidationErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ValidationErrors] = err.message
          }
        })
        setErrors(newErrors)

        // Show toast with first validation error
        const firstError = error.errors[0]?.message
        if (firstError) {
          toast.error(`Validation Error: ${firstError}`)
        }
      }
      return false
    }
  }

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...")

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phonenumber: formData.phonenumber,
          imageUrl: formData.image,
        }),
      })

      const result = await res.json()

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (res.ok) {
        // Show success toast
        toast.success("Account created successfully!", {
          description: `Welcome ${formData.name}! Your account has been created.`,
          duration: 5000,
        })

        // Reset form
        setFormData({
          email: "",
          password: "",
          name: "",
          phonenumber: "",
          image: "",
        })
        setErrors({})
      } else {
        // Show error toast
        toast.error("Failed to create account", {
          description: result.message || "There was an error creating your account",
        })
      }
    } catch (error) {
      console.error("Error creating user:", error)

      // Dismiss loading toast and show error
      toast.dismiss(loadingToast)
      toast.error("Network Error", {
        description: "Unable to connect to the server. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Fill in your details to create a new account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phonenumber">Phone Number</Label>
                <Input
                  id="phonenumber"
                  placeholder="Enter your phone number"
                  value={formData.phonenumber}
                  onChange={(e) => handleInputChange("phonenumber", e.target.value)}
                  className={errors.phonenumber ? "border-red-500" : ""}
                />
                {errors.phonenumber && <p className="text-sm text-red-600">{errors.phonenumber}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="grid gap-3">
                <Label>Profile Image</Label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "user-uploads"}
                  options={{
                    multiple: false,
                    maxFiles: 1,
                    resourceType: "image",
                    maxFileSize: 10000000, // 10MB
                    sources: ["local", "camera"],
                    folder: "user-profiles",
                  }}
                  onSuccess={(result: any) => {
                    console.log("Upload success:", result)
                    setFormData((prev) => ({ ...prev, image: result.info.secure_url }))
                    setErrors((prev) => ({ ...prev, image: undefined }))

                    // Show success toast for image upload
                    toast.success("Image uploaded successfully!", {
                      description: "Your profile image has been uploaded.",
                    })
                  }}
                  onError={(error: any) => {
                    console.error("Upload error:", error)
                    setErrors((prev) => ({ ...prev, image: "Image upload failed" }))

                    // Show error toast for image upload
                    toast.error("Image upload failed", {
                      description: error.message || "Please try uploading your image again.",
                    })
                  }}
                >
                  {({ open }) => (
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className={errors.image ? "border-red-500" : ""}
                      >
                        Upload Image
                      </Button>
                      {formData.image && (
                        <div className="flex items-center gap-2">
                          <img
                            src={formData.image || "/placeholder.svg"}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="text-sm text-green-600">Image uploaded!</span>
                        </div>
                      )}
                      {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="button" onClick={handleSubmit} disabled={isLoading} className="w-full">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <RegisterComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
