"use client"

import { useEffect, useState } from "react"
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

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
    loadUser()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  // Mock student data
  const studentData = {
    currentGPA: 3.4,
    predictedGPA: 3.6,
    attendance: 92,
    assignments: {
      completed: 28,
      total: 32,
      overdue: 2,
    },
    subjects: [
      { name: "Mathematics", grade: "B+", progress: 85 },
      { name: "English", grade: "A-", progress: 90 },
      { name: "Science", grade: "A", progress: 95 },
      { name: "History", grade: "B", progress: 78 },
      { name: "Art", grade: "A+", progress: 98 },
    ],
    upcomingAssignments: [
      { subject: "Mathematics", title: "Algebra Quiz", dueDate: "2024-01-20", priority: "high" },
      { subject: "English", title: "Essay Draft", dueDate: "2024-01-22", priority: "medium" },
      { subject: "Science", title: "Lab Report", dueDate: "2024-01-25", priority: "low" },
    ],
    recentGrades: [
      { subject: "Mathematics", assignment: "Quiz #4", grade: "B+", date: "2024-01-15" },
      { subject: "English", assignment: "Essay", grade: "A-", date: "2024-01-12" },
      { subject: "Science", assignment: "Lab Report", grade: "A", date: "2024-01-10" },
    ],
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
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h2>
            <p className="text-gray-600 mt-2">Here's your academic overview</p>
          </div>

          <StudentNavigation />

          {/* Academic Overview Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.currentGPA}</div>
                <p className="text-xs text-muted-foreground">Predicted: {studentData.predictedGPA}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.attendance}%</div>
                <Progress value={studentData.attendance} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentData.assignments.completed}/{studentData.assignments.total}
                </div>
                <p className="text-xs text-muted-foreground">{studentData.assignments.overdue} overdue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grade Level</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Grade {user?.grade}</div>
                <p className="text-xs text-muted-foreground">Academic Year 2024</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>Your current performance across all subjects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData.subjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.name}</span>
                      <Badge variant="outline">{subject.grade}</Badge>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{subject.progress}% complete</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Don't forget these important deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData.upcomingAssignments.map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{assignment.dueDate}</p>
                      <Badge
                        variant={
                          assignment.priority === "high"
                            ? "destructive"
                            : assignment.priority === "medium"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {assignment.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your latest assignment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.recentGrades.map((grade, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{grade.assignment}</p>
                      <p className="text-sm text-muted-foreground">{grade.subject}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-lg font-bold">
                        {grade.grade}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{grade.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
