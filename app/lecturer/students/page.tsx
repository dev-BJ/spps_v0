"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Search, Filter, LogOut, Eye, Edit, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { LecturerNavigation } from "@/components/lecturer-navigation"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function LecturerStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getUser()
      if (!currentUser || currentUser.role !== "lecturer") {
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

  // Mock students data for lecturer's classes
  const students = [
    {
      id: "STU001",
      name: "Alice Johnson",
      email: "alice.johnson@school.edu",
      grade: 11,
      gpa: 3.8,
      attendance: 95,
      riskLevel: "low",
      predictedGPA: 3.9,
      trend: "up",
      class: "Mathematics 101",
    },
    {
      id: "STU002",
      name: "Bob Smith",
      email: "bob.smith@school.edu",
      grade: 10,
      gpa: 2.1,
      attendance: 78,
      riskLevel: "high",
      predictedGPA: 2.0,
      trend: "down",
      class: "Mathematics 101",
    },
    {
      id: "STU003",
      name: "Carol Davis",
      email: "carol.davis@school.edu",
      grade: 12,
      gpa: 3.2,
      attendance: 88,
      riskLevel: "medium",
      predictedGPA: 3.3,
      trend: "up",
      class: "Advanced Algebra",
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Students</h2>
          </div>

          <LecturerNavigation />

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find students in your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">All Students</Badge>
                <Badge variant="outline">At Risk</Badge>
                <Badge variant="outline">High Performers</Badge>
                <Badge variant="outline">Mathematics 101</Badge>
                <Badge variant="outline">Advanced Algebra</Badge>
                <Badge variant="outline">Statistics</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-sm text-muted-foreground">Class: {student.class}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Grade</p>
                        <p className="text-lg font-bold">{student.grade}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Current GPA</p>
                        <p className="text-lg font-bold">{student.gpa}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Predicted GPA</p>
                        <div className="flex items-center">
                          <p className="text-lg font-bold">{student.predictedGPA}</p>
                          {student.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500 ml-1" />}
                          {student.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500 ml-1" />}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Attendance</p>
                        <p className="text-lg font-bold">{student.attendance}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Risk Level</p>
                        <Badge variant={getRiskBadgeVariant(student.riskLevel)} className="mt-1">
                          {student.riskLevel === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
