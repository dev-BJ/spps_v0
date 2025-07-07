"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, BookOpen, TrendingUp, AlertTriangle, Bell, LogOut, Calendar, Award } from "lucide-react"
import { LecturerNavigation } from "@/components/lecturer-navigation"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LecturerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<any[]>([])
  const router = useRouter()

  const fetch_courses = useCallback(async ()=>{
    const currentUser = await getUser()
    const userId = currentUser?.userId
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${userId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(data => {
      if (!data || data.error) {
        throw new Error("Failed to fetch courses")
      }
      // console.log("Fetched courses:", data)
      setCourses(data.courses)
    })
    .catch(error => {
      console.error("Error fetching courses:", error);
      return []
    })
  }, [courses])

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getUser()
      if (!currentUser || currentUser.role !== "lecturer") {
        router.push("/login")
        return
      }
      setUser(currentUser)
      // console.log("Current User:", currentUser)
      fetch_courses()
      setLoading(false)
    }
    loadUser()
  }, [router])

  // console.log(courses)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  // Mock lecturer data
  const lecturerData = {
    totalStudents: 156,
    averageGPA: 3.2,
    atRiskStudents: 12,
    upcomingClasses: 8,
    classes: [
      { name: "Mathematics 101", students: 32, avgGrade: "B+", nextClass: "Today 10:00 AM" },
      { name: "Advanced Algebra", students: 28, avgGrade: "A-", nextClass: "Today 2:00 PM" },
      { name: "Statistics", students: 24, avgGrade: "B", nextClass: "Tomorrow 9:00 AM" },
    ],
    recentActivity: [
      { type: "grade", message: "Graded 24 assignments for Mathematics 101", time: "2 hours ago" },
      { type: "alert", message: "3 students missed yesterday's class", time: "1 day ago" },
      { type: "assignment", message: "New assignment posted for Advanced Algebra", time: "2 days ago" },
    ],
    pendingTasks: [
      { task: "Grade midterm exams", priority: "high", dueDate: "Today" },
      { task: "Prepare next week's lesson plans", priority: "medium", dueDate: "Friday" },
      { task: "Update student progress reports", priority: "low", dueDate: "Next week" },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">EduPredict</h1>
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
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.department} Department</p>
                </div>
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
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, Prof. {user?.lastName}!</h2>
            <p className="text-gray-600 mt-2">Here's your teaching overview for today</p>
          </div>

          <LecturerNavigation />

          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerData.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerData.averageGPA}</div>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerData.atRiskStudents}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerData.upcomingClasses}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            {/* My Classes */}
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Overview of your current classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((classItem, index) => (
                  <div key={classItem.id || index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{classItem.name || classItem.course_code}</p>
                      {/* <p className="text-sm text-muted-foreground">
                        {classItem.students} students • Avg: {classItem.avgGrade}
                      </p> */}
                    </div>
                    <div className="text-right">
                      {/* <p className="text-sm font-medium">{classItem.nextClass}</p> */}
                      <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                        View Class
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Items that need your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lecturerData.pendingTasks.map((task, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "grade"
                          ? "bg-blue-100"
                          : activity.type === "alert"
                            ? "bg-red-100"
                            : "bg-green-100"
                      }`}
                    >
                      {activity.type === "grade" && <Award className="h-4 w-4 text-blue-600" />}
                      {activity.type === "alert" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {activity.type === "assignment" && <BookOpen className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link href="/lecturer/students">
                <Button>Manage Students</Button>
              </Link>
              <Link href="/lecturer/analytics">
                <Button variant="outline">View Analytics</Button>
              </Link>
              <Button variant="outline">Create Assignment</Button>
              <Button variant="outline">Schedule Class</Button>
              <Button variant="outline">Generate Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
