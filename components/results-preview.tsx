"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Trash2, Save, X, Search } from "lucide-react"

interface ResultsPreviewProps {
  results: any[]
  onResultEdit: (index: number, updatedResult: any) => void
  onResultDelete: (index: number) => void
}

export function ResultsPreview({ results, onResultEdit, onResultDelete }: ResultsPreviewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("studentId")

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditForm({ ...results[index] })
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      // Recalculate derived fields
      const updatedResult = {
        ...editForm,
        percentage: (editForm.score / editForm.maxScore) * 100,
        letterGrade: calculateLetterGrade((editForm.score / editForm.maxScore) * 100),
      }

      onResultEdit(editingIndex, updatedResult)
      setEditingIndex(null)
      setEditForm({})
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditForm({})
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

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.includes("A")) return "default"
    if (grade.includes("B")) return "secondary"
    if (grade.includes("C")) return "outline"
    return "destructive"
  }

  // Filter and sort results
  const filteredResults = results
    .filter((result) => {
      const matchesSearch =
        result.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.lecturer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.semester.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterType === "all" || result.session === filterType

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "studentId":
          return a.student_id.localeCompare(b.student_id)
        case "score":
          return b.exam_score - a.exam_score
        case "percentage":
          return b.percentage - a.percentage
        case "grade":
          return a.meta.letter_grade.localeCompare(b.meta.letter_grade)
        default:
          return 0
      }
    })

  const assignmentTypes = [...new Set(results.map((r) => r.session))]

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No results to preview</p>
            <p className="text-sm text-muted-foreground">Upload some results first</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Results Summary</CardTitle>
          <CardDescription>{results.length} results ready for upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-sm text-muted-foreground">Total Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.percentage >= 90).length}
              </div>
              <div className="text-sm text-muted-foreground">A Grades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{results.filter((r) => r.percentage < 60).length}</div>
              <div className="text-sm text-muted-foreground">Failing Grades</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student ID, name, or assignment..."
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
                  <SelectItem key={type} value={type}>
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
                <SelectItem value="studentId">Student ID</SelectItem>
                <SelectItem value="score">Score (High to Low)</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="grade">Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Results Preview</CardTitle>
          <CardDescription>
            Review and edit results before saving. Showing {filteredResults.length} of {results.length} results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResults.map((result, index) => {
              const originalIndex = results.findIndex((r) => r === result)
              const isEditing = editingIndex === originalIndex

              return (
                <div key={originalIndex} className="p-4 border rounded-lg">
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <label className="text-sm font-medium">Student ID</label>
                          <Input
                            value={editForm.studentId || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, studentId: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Assignment</label>
                          <Input
                            value={editForm.assignment || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, assignment: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Score</label>
                          <Input
                            type="number"
                            value={editForm.score || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, score: Number.parseFloat(e.target.value) || 0 }))
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Max Score</label>
                          <Input
                            type="number"
                            value={editForm.maxScore || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, maxScore: Number.parseFloat(e.target.value) || 100 }))
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex justify-between items-center">
                      <div className="grid gap-2 md:grid-cols-6 flex-1">
                        <div>
                          <div className="text-sm font-medium">{result.student_id.toUpperCase()}</div>
                          <div className="text-xs text-muted-foreground">{result.course_code.toUpperCase()}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{result.weight.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">WGPA</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {result.total_score}/100
                          </div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{result.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Percentage</div>
                        </div>
                        <div>
                          <Badge variant={getGradeBadgeVariant(result.letter_grade)}>{result.letter_grade}</Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{result.course_unit}</div>
                          <div className="text-xs text-muted-foreground">Course Unit</div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(originalIndex)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onResultDelete(originalIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
