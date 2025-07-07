"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

interface ResultUploadFormProps {
  // classes: Array<{ id: string; name: string; students: number }>
  classes: Array<any>
  assignmentTypes: string[]
  onResultAdd: (result: any) => void
}

export function ResultUploadForm({ classes, assignmentTypes, onResultAdd }: ResultUploadFormProps) {
  const [formData, setFormData] = useState({
    classId: "",
    studentId: "",
    studentName: "",
    assignment: "",
    assignmentType: "",
    score: "",
    maxScore: "100",
    weight: "10",
    dueDate: "",
    feedback: "",
    lateSubmission: false,
    attempts: "1",
  })

  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([])
  // console.log("Classes Data", classes)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = {
      ...formData,
      score: Number.parseFloat(formData.score),
      maxScore: Number.parseFloat(formData.maxScore),
      weight: Number.parseFloat(formData.weight),
      attempts: Number.parseInt(formData.attempts),
      percentage: (Number.parseFloat(formData.score) / Number.parseFloat(formData.maxScore)) * 100,
      letterGrade: calculateLetterGrade(
        (Number.parseFloat(formData.score) / Number.parseFloat(formData.maxScore)) * 100,
      ),
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User", // Would come from auth context
    }

    onResultAdd(result)
    setRecentlyAdded((prev) => [result, ...prev.slice(0, 4)]) // Keep last 5

    // Reset form but keep class selection
    setFormData((prev) => ({
      ...prev,
      studentId: "",
      studentName: "",
      assignment: "",
      score: "",
      feedback: "",
      attempts: "1",
    }))
  }

  const calculateLetterGrade = (percentage: number): string => {
    if (percentage >= 97) return "A+"
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 60) return "D"
    return "F"
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedClass = classes.find((c) => c.id === formData.classId)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Individual Result</CardTitle>
            <CardDescription>Enter grade information for a single student</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Class and Student Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select value={formData.classId} onValueChange={(value) => handleInputChange("classId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.course_code}>
                          {cls.course_title} (30 students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    placeholder="e.g., STU001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange("studentName", e.target.value)}
                  placeholder="Auto-filled or enter manually"
                />
              </div>

              {/* Assignment Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="assignment">Assignment Name *</Label>
                  <Input
                    id="assignment"
                    value={formData.assignment}
                    onChange={(e) => handleInputChange("assignment", e.target.value)}
                    placeholder="e.g., Midterm Exam"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignmentType">Assignment Type *</Label>
                  <Select
                    value={formData.assignmentType}
                    onValueChange={(value) => handleInputChange("assignmentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Scoring */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Score *</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.score}
                    onChange={(e) => handleInputChange("score", e.target.value)}
                    placeholder="85"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxScore">Max Score *</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    min="1"
                    value={formData.maxScore}
                    onChange={(e) => handleInputChange("maxScore", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (%)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attempts">Attempts</Label>
                  <Input
                    id="attempts"
                    type="number"
                    min="1"
                    value={formData.attempts}
                    onChange={(e) => handleInputChange("attempts", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => handleInputChange("feedback", e.target.value)}
                  placeholder="Optional feedback for the student..."
                  rows={3}
                />
              </div>

              {/* Preview */}
              {formData.score && formData.maxScore && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Grade Preview</h4>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div>
                      <span className="text-sm text-blue-700">Percentage:</span>
                      <p className="font-bold text-blue-900">
                        {((Number.parseFloat(formData.score) / Number.parseFloat(formData.maxScore)) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Letter Grade:</span>
                      <p className="font-bold text-blue-900">
                        {calculateLetterGrade(
                          (Number.parseFloat(formData.score) / Number.parseFloat(formData.maxScore)) * 100,
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-700">Points:</span>
                      <p className="font-bold text-blue-900">
                        {formData.score}/{formData.maxScore}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.classId || !formData.studentId || !formData.assignment || !formData.score}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Result
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Recently Added */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recently Added</CardTitle>
            <CardDescription>Last {recentlyAdded.length} results added</CardDescription>
          </CardHeader>
          <CardContent>
            {recentlyAdded.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No results added yet</p>
            ) : (
              <div className="space-y-3">
                {recentlyAdded.map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{result.studentId}</p>
                        <p className="text-xs text-muted-foreground">{result.assignment}</p>
                      </div>
                      <Badge variant="outline">{result.letterGrade}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.score}/{result.maxScore} ({result.percentage.toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {selectedClass && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Class Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Class:</span>
                  <span className="text-sm font-medium">{selectedClass.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Students:</span>
                  <span className="text-sm font-medium">{selectedClass.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Results Added:</span>
                  <span className="text-sm font-medium">{recentlyAdded.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
