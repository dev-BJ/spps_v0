"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, BookOpen } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  grade: number
  gpa: number
  attendance: number
  riskLevel: "low" | "medium" | "high"
  predictedGPA: number
  trend: "up" | "down" | "stable"
}

interface StudentDetailDialogProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentDetailDialog({ student, open, onOpenChange }: StudentDetailDialogProps) {
  if (!student) return null

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

  // Mock detailed data
  const detailedData = {
    subjects: [
      { name: "Mathematics", grade: "A-", score: 87 },
      { name: "English", grade: "B+", score: 82 },
      { name: "Science", grade: "A", score: 91 },
      { name: "History", grade: "B", score: 78 },
      { name: "Art", grade: "A+", score: 95 },
    ],
    recentAssignments: [
      { name: "Math Quiz #3", score: 85, date: "2024-01-15" },
      { name: "English Essay", score: 88, date: "2024-01-12" },
      { name: "Science Lab Report", score: 92, date: "2024-01-10" },
    ],
    behaviorMetrics: {
      participation: 85,
      homework: 92,
      punctuality: 88,
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
              <AvatarFallback>
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-muted-foreground">{student.email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>Detailed student profile and performance analytics</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Academic Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Student ID:</span>
                <span className="font-medium">{student.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Grade Level:</span>
                <span className="font-medium">{student.grade}</span>
              </div>
              <div className="flex justify-between">
                <span>Current GPA:</span>
                <span className="font-medium">{student.gpa}</span>
              </div>
              <div className="flex justify-between">
                <span>Predicted GPA:</span>
                <div className="flex items-center">
                  <span className="font-medium">{student.predictedGPA}</span>
                  {student.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500 ml-1" />}
                  {student.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500 ml-1" />}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <Badge variant={getRiskBadgeVariant(student.riskLevel)}>
                  {student.riskLevel === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Attendance & Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Attendance Rate</span>
                  <span className="font-medium">{student.attendance}%</span>
                </div>
                <Progress value={student.attendance} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Class Participation</span>
                  <span className="font-medium">{detailedData.behaviorMetrics.participation}%</span>
                </div>
                <Progress value={detailedData.behaviorMetrics.participation} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Homework Completion</span>
                  <span className="font-medium">{detailedData.behaviorMetrics.homework}%</span>
                </div>
                <Progress value={detailedData.behaviorMetrics.homework} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Punctuality</span>
                  <span className="font-medium">{detailedData.behaviorMetrics.punctuality}%</span>
                </div>
                <Progress value={detailedData.behaviorMetrics.punctuality} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Current grades across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detailedData.subjects.map((subject, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{subject.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{subject.grade}</span>
                      <span className="text-sm text-muted-foreground">({subject.score}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Latest assignment scores and dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detailedData.recentAssignments.map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{assignment.name}</p>
                      <p className="text-sm text-muted-foreground">{assignment.date}</p>
                    </div>
                    <span className="font-medium">{assignment.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Prediction Analysis
            </CardTitle>
            <CardDescription>AI-powered insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Prediction Summary</h4>
                <p className="text-blue-800 mt-1">
                  Based on current performance trends, {student.name} is predicted to achieve a GPA of{" "}
                  {student.predictedGPA} by the end of the semester.
                  {student.trend === "up" && " The upward trend indicates improving performance."}
                  {student.trend === "down" && " The downward trend suggests intervention may be needed."}
                </p>
              </div>

              {student.riskLevel === "high" && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Risk Factors
                  </h4>
                  <ul className="text-red-800 mt-1 list-disc list-inside">
                    <li>Low attendance rate affecting learning continuity</li>
                    <li>Declining performance in core subjects</li>
                    <li>Recommended for additional tutoring support</li>
                  </ul>
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Recommendations</h4>
                <ul className="text-green-800 mt-1 list-disc list-inside">
                  <li>Continue current study patterns for strong subjects</li>
                  <li>Focus additional attention on weaker subject areas</li>
                  <li>Maintain regular attendance for optimal learning</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
