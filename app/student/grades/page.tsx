"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, TrendingUp, TrendingDown, Calendar, Award, Download, Filter, Bell, LogOut } from "lucide-react"
import { StudentNavigation } from "@/components/student-navigation"
import { GradeChart } from "@/components/grade-chart"
import { SubjectBreakdown } from "@/components/subject-breakdown"
import { AssignmentHistory } from "@/components/assignment-history"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PredictionDashboard } from "@/components/prediction-dashboard"
import { AdvisoryDashboard } from "@/components/advisory-dashboard"

export default function StudentGradesPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [advisoryData, setAdvisoryData] = useState<any>(null)
  const [selectedSemester, setSelectedSemester] = useState("current")
  const [selectedSubject, setSelectedSubject] = useState("all")
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
    fetch_advisory_data()
  }, [router])

  const fetch_advisory_data = useCallback(async () => {
    const currentUser = await getUser()
    const userId = currentUser?.userId
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "user_id": userId
      })
    })
    const data = await response.json()
    console.log(data)
    setAdvisoryData(data)
    return data
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  // Mock comprehensive grade data
  const gradeData = {
    currentGPA: 3.42,
    cumulativeGPA: 3.38,
    classRank: 23,
    totalStudents: 156,
    creditsEarned: 18.5,
    creditsRequired: 24,
    subjects: [
      {
        id: "math",
        name: "Mathematics",
        teacher: "Mr. Johnson",
        currentGrade: "B+",
        percentage: 87.5,
        credits: 4,
        assignments: [
          { name: "Quiz 1", type: "Quiz", score: 85, maxScore: 100, date: "2024-01-15", weight: 10 },
          { name: "Midterm Exam", type: "Exam", score: 92, maxScore: 100, date: "2024-01-20", weight: 25 },
          { name: "Homework Set 1", type: "Homework", score: 88, maxScore: 100, date: "2024-01-10", weight: 15 },
          { name: "Project", type: "Project", score: 90, maxScore: 100, date: "2024-01-25", weight: 20 },
          { name: "Quiz 2", type: "Quiz", score: 82, maxScore: 100, date: "2024-01-28", weight: 10 },
        ],
        trend: "up",
        attendance: 95,
      },
      {
        id: "english",
        name: "English Literature",
        teacher: "Ms. Davis",
        currentGrade: "A-",
        percentage: 91.2,
        credits: 3,
        assignments: [
          { name: "Essay 1", type: "Essay", score: 94, maxScore: 100, date: "2024-01-12", weight: 25 },
          { name: "Reading Quiz", type: "Quiz", score: 88, maxScore: 100, date: "2024-01-18", weight: 15 },
          { name: "Presentation", type: "Presentation", score: 92, maxScore: 100, date: "2024-01-22", weight: 20 },
          { name: "Midterm", type: "Exam", score: 89, maxScore: 100, date: "2024-01-26", weight: 30 },
        ],
        trend: "stable",
        attendance: 98,
      },
      {
        id: "science",
        name: "Biology",
        teacher: "Dr. Wilson",
        currentGrade: "A",
        percentage: 94.8,
        credits: 4,
        assignments: [
          { name: "Lab Report 1", type: "Lab", score: 96, maxScore: 100, date: "2024-01-14", weight: 20 },
          { name: "Chapter Test", type: "Test", score: 93, maxScore: 100, date: "2024-01-19", weight: 25 },
          { name: "Lab Report 2", type: "Lab", score: 98, maxScore: 100, date: "2024-01-24", weight: 20 },
          { name: "Quiz", type: "Quiz", score: 92, maxScore: 100, date: "2024-01-29", weight: 15 },
        ],
        trend: "up",
        attendance: 100,
      },
      {
        id: "history",
        name: "World History",
        teacher: "Mr. Brown",
        currentGrade: "B",
        percentage: 83.4,
        credits: 3,
        assignments: [
          { name: "Research Paper", type: "Paper", score: 85, maxScore: 100, date: "2024-01-16", weight: 30 },
          { name: "Unit Test", type: "Test", score: 78, maxScore: 100, date: "2024-01-21", weight: 25 },
          { name: "Discussion Posts", type: "Participation", score: 88, maxScore: 100, date: "2024-01-27", weight: 20 },
        ],
        trend: "down",
        attendance: 92,
      },
      {
        id: "art",
        name: "Visual Arts",
        teacher: "Ms. Garcia",
        currentGrade: "A+",
        percentage: 97.1,
        credits: 2,
        assignments: [
          { name: "Portfolio 1", type: "Portfolio", score: 98, maxScore: 100, date: "2024-01-13", weight: 40 },
          { name: "Sketch Assignment", type: "Assignment", score: 95, maxScore: 100, date: "2024-01-20", weight: 25 },
          { name: "Art Critique", type: "Essay", score: 99, maxScore: 100, date: "2024-01-25", weight: 35 },
        ],
        trend: "up",
        attendance: 96,
      },
    ],
    semesterHistory: [
      { semester: "Fall 2023", gpa: 3.35, credits: 16 },
      { semester: "Spring 2024", gpa: 3.42, credits: 18.5 },
    ],
    upcomingAssignments: [
      { subject: "Mathematics", name: "Final Exam", dueDate: "2024-02-15", weight: 30 },
      { subject: "English Literature", name: "Final Essay", dueDate: "2024-02-12", weight: 25 },
      { subject: "Biology", name: "Lab Final", dueDate: "2024-02-18", weight: 25 },
    ],
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith("A")) return "default"
    if (grade.startsWith("B")) return "secondary"
    if (grade.startsWith("C")) return "outline"
    return "destructive"
  }

  const filteredSubjects =
    selectedSubject === "all"
      ? gradeData.subjects
      : gradeData.subjects.filter((subject) => subject.id === selectedSubject)

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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Academic Performance</h2>
              <p className="text-gray-600 mt-2">Detailed view of your grades and progress</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Transcript
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <StudentNavigation />

          {/* Academic Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradeData.currentGPA}</div>
                <p className="text-xs text-muted-foreground">Cumulative: {gradeData.cumulativeGPA}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{gradeData.classRank}</div>
                <p className="text-xs text-muted-foreground">of {gradeData.totalStudents} students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gradeData.creditsEarned}</div>
                <Progress value={(gradeData.creditsEarned / gradeData.creditsRequired) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">of {gradeData.creditsRequired} required</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grade Level</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Grade {user?.grade}</div>
                <p className="text-xs text-muted-foreground">Spring 2024</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Semester</SelectItem>
                <SelectItem value="fall2023">Fall 2023</SelectItem>
                <SelectItem value="spring2024">Spring 2024</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="english">English Literature</SelectItem>
                <SelectItem value="science">Biology</SelectItem>
                <SelectItem value="history">World History</SelectItem>
                <SelectItem value="art">Visual Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="advisory">Advisory</TabsTrigger>
              {/* <TabsTrigger value="predictions">AI Predictions</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Subject Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subjects</CardTitle>
                  <CardDescription>Overview of all your current classes and grades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSubjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{subject.name}</h3>
                            <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                            <p className="text-xs text-muted-foreground">{subject.credits} credits</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm font-medium">Current Grade</p>
                            <Badge variant={getGradeBadgeVariant(subject.currentGrade)} className="text-lg font-bold">
                              {subject.currentGrade}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Percentage</p>
                            <p className={`text-lg font-bold ${getGradeColor(subject.percentage)}`}>
                              {subject.percentage}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Attendance</p>
                            <p className="text-lg font-bold">{subject.attendance}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Trend</p>
                            {subject.trend === "up" && <TrendingUp className="h-5 w-5 text-green-500 mx-auto" />}
                            {subject.trend === "down" && <TrendingDown className="h-5 w-5 text-red-500 mx-auto" />}
                            {subject.trend === "stable" && <div className="h-5 w-5 bg-gray-300 rounded-full mx-auto" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Major Assignments</CardTitle>
                  <CardDescription>Important assignments and exams coming up</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gradeData.upcomingAssignments.map((assignment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{assignment.name}</p>
                          <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{assignment.dueDate}</p>
                          <p className="text-xs text-muted-foreground">{assignment.weight}% of grade</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <SubjectBreakdown subjects={filteredSubjects} />
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <AssignmentHistory subjects={filteredSubjects} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <GradeChart subjects={gradeData.subjects} semesterHistory={gradeData.semesterHistory} />
            </TabsContent>

            {/* <TabsContent value="predictions" className="space-y-6">
              <PredictionDashboard subjects={filteredSubjects} />
            </TabsContent> */}

            <TabsContent value="advisory" className="space-y-6">
              <AdvisoryDashboard advisory={advisoryData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
