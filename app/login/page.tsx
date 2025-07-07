"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, User, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const user_id = formData.get("user_id") as string
      const password = formData.get("password") as string

      const result = await login(user_id.toLowerCase(), password)

      if (result.success) {
        // Redirect based on role
        if (result.role === "student") {
          router.push("/student/dashboard")
        } else {
          router.push("/lecturer/dashboard")
        }
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* <GraduationCap className="h-12 w-12 text-blue-600" /> */}
            <Image
                            src="/oou-logo.png"
                            alt="OOU Logo"
                            width={500}
                            height={500}
                            className="h-[150] w-[150] rounded-full"
                            style={{ objectFit: "cover" }}
                          />
          </div>
          {/* <h1 className="text-3xl font-bold text-gray-900">OOU</h1> */}
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            {/* <CardDescription>Choose your account type to continue</CardDescription> */}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              {/* <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="lecturer" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Lecturer
                </TabsTrigger>
              </TabsList> */}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="student">
                <form action={(formData) => handleLogin(formData)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_id">Username</Label>
                    <Input
                      id="user_id"
                      name="user_id"
                      type="text"
                      placeholder="15H/0001/CS"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input id="student-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
                {/* <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div> */}
              </TabsContent>

              {/* <TabsContent value="lecturer">
                <form action={(formData) => handleLogin(formData, "lecturer")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-email">Email</Label>
                    <Input
                      id="lecturer-email"
                      name="email"
                      type="email"
                      placeholder="lecturer@school.edu"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-password">Password</Label>
                    <Input id="lecturer-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Lecturer"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </TabsContent> */}
            </Tabs>

            <div className="mt-6 pt-4 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <strong>Demo Credentials:</strong>
                </p>
                <p>Student: 15H/0001/CS / 1234567</p>
                <p>Lecturer: john.doe / 1234567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
