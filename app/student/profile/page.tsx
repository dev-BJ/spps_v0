"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, TrendingUp, Award, Bell, LogOut } from "lucide-react"
import { StudentNavigation } from "@/components/student-navigation"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Image from 'next/image'

export default function StudentProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [currentGPA, setCurrentGPA] = useState<{current_gpa: number} | null>(null)
  let requestSent = false;

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getUser()
      if (!currentUser || currentUser.role !== "student") {
        router.push("/login")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    if (!requestSent) {
      requestSent = true;
      loadUser()
      fetch_current_gpa()
    }
  }, [router])

  const fetch_current_gpa = useCallback(async () => {
      // localStorage.removeItem("current_gpa")
      const currentUser = await getUser()
      const userId = currentUser?.userId
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/current_gpa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "user_id": userId
        })
      })
      const data = await response.json();
      // console.log(data)
      setCurrentGPA(data)
      // localStorage.setItem("current_gpa", JSON.stringify(data))
      // return data
    }, [])
  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {/* <BookOpen className="h-8 w-8 text-blue-600" /> */}
              <Image
                  src="/oou-logo.png"
                  alt="OOU Logo"
                  width={500}
                  height={500}
                  className="h-20 w-20 rounded-full"
                  style={{ objectFit: "cover" }}
                />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TASUED</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Academic Profile</h2>
            <p className="text-gray-600 mt-2">Here's your academic profile</p>
          </div>

          <StudentNavigation />

          {/* Academic Overview Cards lg:grid-cols-4 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">
                {currentGPA ? currentGPA.current_gpa.toFixed(2) : 0.00}
              </div>
                {/* <p className="text-xs text-muted-foreground">Predicted: {studentData.predictedGPA}</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grade Level</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.grade || 400} Level</div>
                {/* <p className="text-xs text-muted-foreground">Academic Year 2025</p> */}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Subject Progress lg:grid-cols-2*/}
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                {/* <CardDescription>Your current performance across all subjects</CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-4">
                {user && (
                  <div className="space-y-2">
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Full Name:</span> {user.firstName} {user.lastName}</div>
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Email:</span> {user.email}</div>
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Student ID:</span> {user.userId}</div>
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Department:</span> {user.department}</div>
                    {/* <div className="text-sm"><span className="font-medium">Faculty:</span> {user.faculty}</div> */}
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Level:</span> {user?.grade || 400} Level</div>
                    {/* <div className="text-sm"><span className="font-medium">Academic Year:</span> {user.academicYear || "2023/2024"}</div> */}
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Date of Birth:</span> {user.date_of_birth || "N/A"}</div>
                    {/* <div className="text-sm"><span className="font-medium">Phone Number:</span> {user.phoneNumber || "N/A"}</div> */}
                    {/* <div className="text-sm"><span className="font-medium">Address:</span> {user.address || "N/A"}</div> */}
                    <div className="text-sm md:text-md lg:text-lg space-y-2"><span className="font-medium">Gender:</span> {user.gender}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
