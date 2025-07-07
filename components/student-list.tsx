"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Edit, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { StudentDetailDialog } from "./student-detail-dialog"

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

const mockStudents: Student[] = [
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
  },
  {
    id: "STU004",
    name: "David Wilson",
    email: "david.wilson@school.edu",
    grade: 9,
    gpa: 3.6,
    attendance: 92,
    riskLevel: "low",
    predictedGPA: 3.7,
    trend: "stable",
  },
  {
    id: "STU005",
    name: "Emma Brown",
    email: "emma.brown@school.edu",
    grade: 11,
    gpa: 2.8,
    attendance: 82,
    riskLevel: "medium",
    predictedGPA: 2.9,
    trend: "up",
  },
]

interface StudentListProps {
  searchTerm: string
}

export function StudentList({ searchTerm }: StudentListProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const filteredStudents = mockStudents.filter(
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

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailDialog(true)
  }

  return (
    <>
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
                    <p className="text-sm text-muted-foreground">ID: {student.id}</p>
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
                  <Button variant="outline" size="sm" onClick={() => handleViewStudent(student)}>
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

      <StudentDetailDialog student={selectedStudent} open={showDetailDialog} onOpenChange={setShowDetailDialog} />
    </>
  )
}
