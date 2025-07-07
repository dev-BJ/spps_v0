"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, User, BookOpen, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signup } from "@/lib/auth"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSignup = async (formData: FormData, role: "student" | "lecturer") => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string

      if (password !== confirmPassword) {
        setError("Passwords don't match")
        return
      }

      const additionalData =
        role === "student"
          ? { grade: formData.get("grade") as string }
          : { department: formData.get("department") as string }

      const result = await signup(email, password, role, firstName, lastName, additionalData)

      if (result.success) {
        setSuccess("Account created successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.error || "Signup failed")
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
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EduPredict</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Choose your account type to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="lecturer" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Lecturer
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="student">
                <form action={(formData) => handleSignup(formData, "student")} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-firstName">First Name</Label>
                      <Input id="student-firstName" name="firstName" required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-lastName">Last Name</Label>
                      <Input id="student-lastName" name="lastName" required disabled={isLoading} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      name="email"
                      type="email"
                      placeholder="student@school.edu"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-grade">Grade Level</Label>
                    <Select name="grade" required disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input id="student-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-confirmPassword">Confirm Password</Label>
                    <Input
                      id="student-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="lecturer">
                <form action={(formData) => handleSignup(formData, "lecturer")} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lecturer-firstName">First Name</Label>
                      <Input id="lecturer-firstName" name="firstName" required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lecturer-lastName">Last Name</Label>
                      <Input id="lecturer-lastName" name="lastName" required disabled={isLoading} />
                    </div>
                  </div>
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
                    <Label htmlFor="lecturer-department">Department</Label>
                    <Select name="department" required disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="physical-education">Physical Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-password">Password</Label>
                    <Input id="lecturer-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-confirmPassword">Confirm Password</Label>
                    <Input
                      id="lecturer-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Lecturer Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
