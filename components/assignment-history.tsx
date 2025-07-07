"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter } from "lucide-react"
import { useState } from "react"

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
  assignments: Assignment[]
}

interface AssignmentHistoryProps {
  subjects: Subject[]
}

export function AssignmentHistory({ subjects }: AssignmentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Flatten all assignments from all subjects
  const allAssignments = subjects.flatMap((subject) =>
    subject.assignments.map((assignment) => ({
      ...assignment,
      subject: subject.name,
      subjectId: subject.id,
    })),
  )

  // Filter and sort assignments
  const filteredAssignments = allAssignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || assignment.type.toLowerCase() === filterType.toLowerCase()
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "score":
          return b.score / b.maxScore - a.score / a.maxScore
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

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

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const assignmentTypes = [...new Set(allAssignments.map((a) => a.type))]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
          <CardDescription>Complete record of all your assignments and grades</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {assignmentTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="score">Score (Highest)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignment List */}
          <div className="space-y-3">
            {filteredAssignments.map((assignment, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Badge variant={getAssignmentTypeColor(assignment.type)} className="text-xs">
                    {assignment.type}
                  </Badge>
                  <div>
                    <p className="font-medium">{assignment.name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {assignment.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getScoreColor(assignment.score, assignment.maxScore)}`}>
                    {assignment.score}/{assignment.maxScore}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((assignment.score / assignment.maxScore) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">{assignment.weight}% of grade</p>
                </div>
              </div>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assignments found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Statistics</CardTitle>
          <CardDescription>Overview of your assignment performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{allAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(
                  allAssignments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / allAssignments.length,
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {allAssignments.filter((a) => a.score / a.maxScore >= 0.9).length}
              </p>
              <p className="text-sm text-muted-foreground">A Grades (90%+)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.max(...allAssignments.map((a) => Math.round((a.score / a.maxScore) * 100)))}%
              </p>
              <p className="text-sm text-muted-foreground">Highest Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
