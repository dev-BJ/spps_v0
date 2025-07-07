"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, TrendingUp, TrendingDown } from "lucide-react"

interface Assignment {
  name: string
  type: string
  score: number
  maxScore: number
  date: string
  weight: number
}

interface Subject {
  id: string
  name: string
  teacher: string
  currentGrade: string
  percentage: number
  credits: number
  assignments: Assignment[]
  trend: string
  attendance: number
}

interface SubjectBreakdownProps {
  subjects: Subject[]
}

export function SubjectBreakdown({ subjects }: SubjectBreakdownProps) {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getAssignmentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "exam":
      case "test":
        return "destructive"
      case "quiz":
        return "secondary"
      case "project":
      case "portfolio":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {subjects.map((subject) => (
        <Card key={subject.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {subject.name}
                </CardTitle>
                <CardDescription>
                  {subject.teacher} • {subject.credits} credits
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-lg font-bold">
                    {subject.currentGrade}
                  </Badge>
                  {subject.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {subject.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
                <p className={`text-sm font-medium ${getGradeColor(subject.percentage)}`}>{subject.percentage}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Grade Breakdown */}
            <div>
              <h4 className="font-semibold mb-3">Grade Breakdown</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Grade</span>
                    <span className="font-medium">{subject.percentage}%</span>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
                    <span className="font-medium">{subject.attendance}%</span>
                  </div>
                  <Progress value={subject.attendance} className="h-2" />
                </div>
              </div>
            </div>

            {/* Assignment History */}
            <div>
              <h4 className="font-semibold mb-3">Recent Assignments</h4>
              <div className="space-y-3">
                {subject.assignments.slice(0, 5).map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getAssignmentTypeColor(assignment.type)} className="text-xs">
                        {assignment.type}
                      </Badge>
                      <div>
                        <p className="font-medium">{assignment.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {assignment.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {assignment.score}/{assignment.maxScore}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((assignment.score / assignment.maxScore) * 100)}% • {assignment.weight}% weight
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Assignment Type Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(
                  subject.assignments.reduce(
                    (acc, assignment) => {
                      if (!acc[assignment.type]) {
                        acc[assignment.type] = { total: 0, count: 0, weight: 0 }
                      }
                      acc[assignment.type].total += (assignment.score / assignment.maxScore) * 100
                      acc[assignment.type].count += 1
                      acc[assignment.type].weight += assignment.weight
                      return acc
                    },
                    {} as Record<string, { total: number; count: number; weight: number }>,
                  ),
                ).map(([type, data]) => {
                  const average = data.total / data.count
                  return (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{type}s</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{Math.round(average)}% avg</span>
                        <span className="text-xs text-muted-foreground">({data.weight}% of grade)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
