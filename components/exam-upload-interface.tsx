"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileText, Plus, Minus, Calculator, Users, BarChart3, AlertTriangle, CheckCircle, Download } from "lucide-react"

interface ExamUploadInterfaceProps {
  classes: Array<{ id: string; name: string; students: number }>
  onExamResultsUpload: (results: any[]) => void
}

export function ExamUploadInterface({ classes, onExamResultsUpload }: ExamUploadInterfaceProps) {
  const [examDetails, setExamDetails] = useState({
    classId: "",
    examName: "",
    examType: "",
    examDate: "",
    duration: "",
    totalMarks: "100",
    passingMarks: "40",
    instructions: "",
    weightage: "25",
  })

  const [questions, setQuestions] = useState([{ id: 1, question: "", marks: 10, type: "objective" }])

  const [studentResults, setStudentResults] = useState<any[]>([])
  const [bulkUploadMode, setBulkUploadMode] = useState(false)
  const [examStats, setExamStats] = useState<any>(null)

  const examTypes = [
    "Midterm Exam",
    "Final Exam",
    "Unit Test",
    "Pop Quiz",
    "Practical Exam",
    "Oral Exam",
    "Online Assessment",
  ]

  const questionTypes = ["Objective", "Subjective", "Practical", "Essay"]

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      marks: 5,
      type: "objective",
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + Number(q.marks), 0)
  }

  const handleExamDetailsChange = (field: string, value: string) => {
    setExamDetails((prev) => ({ ...prev, [field]: value }))
  }

  const generateStudentTemplate = () => {
    if (!examDetails.classId) {
      alert("Please select a class first")
      return
    }

    // Mock student list - in real app, fetch from API
    const mockStudents = Array.from({ length: 30 }, (_, i) => ({
      studentId: `STU${String(i + 1).padStart(3, "0")}`,
      studentName: `Student ${i + 1}`,
      rollNumber: i + 1,
    }))

    setStudentResults(
      mockStudents.map((student) => ({
        ...student,
        questionScores: questions.map((q) => ({ questionId: q.id, score: 0, maxScore: q.marks })),
        totalScore: 0,
        percentage: 0,
        grade: "F",
        status: "absent",
        remarks: "",
      })),
    )
  }

  const updateStudentScore = (studentIndex: number, questionId: number, score: number) => {
    const updatedResults = [...studentResults]
    const student = updatedResults[studentIndex]

    // Update question score
    const questionIndex = student.questionScores.findIndex((q: any) => q.questionId === questionId)
    if (questionIndex !== -1) {
      student.questionScores[questionIndex].score = score
    }

    // Recalculate total
    student.totalScore = student.questionScores.reduce((sum: number, q: any) => sum + q.score, 0)
    student.percentage = (student.totalScore / calculateTotalMarks()) * 100
    student.grade = calculateGrade(student.percentage)
    student.status = student.totalScore > 0 ? "present" : "absent"

    setStudentResults(updatedResults)
    calculateExamStats(updatedResults)
  }

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    if (percentage >= Number(examDetails.passingMarks)) return "D"
    return "F"
  }

  const calculateExamStats = (results: any[]) => {
    const presentStudents = results.filter((s) => s.status === "present")
    const passedStudents = presentStudents.filter((s) => s.percentage >= Number(examDetails.passingMarks))

    const stats = {
      totalStudents: results.length,
      presentStudents: presentStudents.length,
      absentStudents: results.length - presentStudents.length,
      passedStudents: passedStudents.length,
      failedStudents: presentStudents.length - passedStudents.length,
      averageScore:
        presentStudents.length > 0
          ? presentStudents.reduce((sum, s) => sum + s.percentage, 0) / presentStudents.length
          : 0,
      highestScore: presentStudents.length > 0 ? Math.max(...presentStudents.map((s) => s.percentage)) : 0,
      lowestScore: presentStudents.length > 0 ? Math.min(...presentStudents.map((s) => s.percentage)) : 0,
      passPercentage: presentStudents.length > 0 ? (passedStudents.length / presentStudents.length) * 100 : 0,
    }

    setExamStats(stats)
  }

  const handleBulkUpload = (file: File) => {
    // Process bulk upload file
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",")

        const results = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",")
          if (values.length === headers.length) {
            const studentResult = {
              studentId: values[0],
              studentName: values[1],
              rollNumber: Number(values[2]),
              questionScores: questions.map((q, index) => ({
                questionId: q.id,
                score: Number(values[3 + index]) || 0,
                maxScore: q.marks,
              })),
              totalScore: 0,
              percentage: 0,
              grade: "F",
              status: "present",
              remarks: values[values.length - 1] || "",
            }

            studentResult.totalScore = studentResult.questionScores.reduce((sum: number, q: any) => sum + q.score, 0)
            studentResult.percentage = (studentResult.totalScore / calculateTotalMarks()) * 100
            studentResult.grade = calculateGrade(studentResult.percentage)

            results.push(studentResult)
          }
        }

        setStudentResults(results)
        calculateExamStats(results)
      } catch (error) {
        alert("Error processing file. Please check the format.")
      }
    }
    reader.readAsText(file)
  }

  const downloadTemplate = () => {
    const headers = [
      "Student ID",
      "Student Name",
      "Roll Number",
      ...questions.map((q) => `Q${q.id} (${q.marks}m)`),
      "Remarks",
    ]

    const csvContent =
      headers.join(",") +
      "\n" +
      "STU001,John Doe,1," +
      questions.map(() => "0").join(",") +
      ",\n" +
      "STU002,Jane Smith,2," +
      questions.map(() => "0").join(",") +
      ",\n"

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${examDetails.examName || "exam"}_template.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const saveExamResults = () => {
    if (!examDetails.classId || !examDetails.examName) {
      alert("Please fill in exam details first")
      return
    }

    const examData = {
      examDetails,
      questions,
      studentResults,
      stats: examStats,
      uploadedAt: new Date().toISOString(),
    }

    onExamResultsUpload([examData])
    alert("Exam results saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Exam Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Exam Setup
          </CardTitle>
          <CardDescription>Configure exam details and question structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="examClass">Class *</Label>
              <Select value={examDetails.classId} onValueChange={(value) => handleExamDetailsChange("classId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.students} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name *</Label>
              <Input
                id="examName"
                value={examDetails.examName}
                onChange={(e) => handleExamDetailsChange("examName", e.target.value)}
                placeholder="e.g., Midterm Exam - Chapter 1-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select
                value={examDetails.examType}
                onValueChange={(value) => handleExamDetailsChange("examType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                type="date"
                value={examDetails.examDate}
                onChange={(e) => handleExamDetailsChange("examDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={examDetails.duration}
                onChange={(e) => handleExamDetailsChange("duration", e.target.value)}
                placeholder="90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightage">Weightage (%)</Label>
              <Input
                id="weightage"
                type="number"
                value={examDetails.weightage}
                onChange={(e) => handleExamDetailsChange("weightage", e.target.value)}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingMarks">Passing Percentage</Label>
              <Input
                id="passingMarks"
                type="number"
                value={examDetails.passingMarks}
                onChange={(e) => handleExamDetailsChange("passingMarks", e.target.value)}
                placeholder="40"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={examDetails.instructions}
              onChange={(e) => handleExamDetailsChange("instructions", e.target.value)}
              placeholder="Special instructions for this exam..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Question Structure
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Total: {calculateTotalMarks()} marks</Badge>
              <Button size="sm" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Define the questions and their marking scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  {questions.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Question Description</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                      placeholder="Enter question description or topic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Marks</Label>
                    <Input
                      type="number"
                      value={question.marks}
                      onChange={(e) => updateQuestion(question.id, "marks", Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Label>Question Type</Label>
                  <Select value={question.type} onValueChange={(value) => updateQuestion(question.id, "type", value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Entry */}
      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Student Results Entry
                </div>
                <Button onClick={generateStudentTemplate} disabled={!examDetails.classId}>
                  Generate Student List
                </Button>
              </CardTitle>
              <CardDescription>Enter scores for each student and question</CardDescription>
            </CardHeader>
            <CardContent>
              {studentResults.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No students loaded</p>
                  <p className="text-sm text-muted-foreground">Generate student list to start entering results</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Student</th>
                          {questions.map((q, index) => (
                            <th key={q.id} className="text-center p-2">
                              Q{index + 1}
                              <br />
                              <span className="text-xs text-muted-foreground">({q.marks}m)</span>
                            </th>
                          ))}
                          <th className="text-center p-2">Total</th>
                          <th className="text-center p-2">%</th>
                          <th className="text-center p-2">Grade</th>
                          <th className="text-center p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentResults.slice(0, 10).map((student, studentIndex) => (
                          <tr key={student.studentId} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{student.studentId}</div>
                                <div className="text-sm text-muted-foreground">{student.studentName}</div>
                              </div>
                            </td>
                            {questions.map((question) => {
                              const questionScore = student.questionScores.find(
                                (q: any) => q.questionId === question.id,
                              )
                              return (
                                <td key={question.id} className="p-2 text-center">
                                  <Input
                                    type="number"
                                    min="0"
                                    max={question.marks}
                                    value={questionScore?.score || 0}
                                    onChange={(e) =>
                                      updateStudentScore(studentIndex, question.id, Number(e.target.value))
                                    }
                                    className="w-16 text-center"
                                  />
                                </td>
                              )
                            })}
                            <td className="p-2 text-center font-medium">
                              {student.totalScore}/{calculateTotalMarks()}
                            </td>
                            <td className="p-2 text-center">{student.percentage.toFixed(1)}%</td>
                            <td className="p-2 text-center">
                              <Badge
                                variant={
                                  student.grade.startsWith("A")
                                    ? "default"
                                    : student.grade.startsWith("B")
                                      ? "secondary"
                                      : student.grade === "F"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {student.grade}
                              </Badge>
                            </td>
                            <td className="p-2 text-center">
                              <Badge variant={student.status === "present" ? "default" : "secondary"}>
                                {student.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {studentResults.length > 10 && (
                    <div className="text-center text-sm text-muted-foreground">
                      Showing first 10 students. Total: {studentResults.length} students
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Results</CardTitle>
              <CardDescription>Upload exam results from a CSV file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Download Template</h4>
                    <p className="text-sm text-blue-700">Get the CSV template with current question structure</p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload Results File</p>
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with student scores for each question
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleBulkUpload(file)
                    }}
                    className="mt-4 max-w-xs mx-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exam Statistics */}
      {examStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Exam Statistics
            </CardTitle>
            <CardDescription>Performance overview and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{examStats.presentStudents}</div>
                <div className="text-sm text-blue-600">Present</div>
                <div className="text-xs text-muted-foreground">{examStats.absentStudents} absent</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{examStats.passedStudents}</div>
                <div className="text-sm text-green-600">Passed</div>
                <div className="text-xs text-muted-foreground">{examStats.passPercentage.toFixed(1)}% pass rate</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{examStats.averageScore.toFixed(1)}%</div>
                <div className="text-sm text-yellow-600">Average</div>
                <div className="text-xs text-muted-foreground">Class average</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{examStats.highestScore.toFixed(1)}%</div>
                <div className="text-sm text-purple-600">Highest</div>
                <div className="text-xs text-muted-foreground">Best performance</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Pass Rate</span>
                <span>{examStats.passPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={examStats.passPercentage} className="h-3" />
            </div>

            {examStats.passPercentage < 60 && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Low pass rate detected. Consider reviewing the exam difficulty or providing additional support.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Results */}
      {studentResults.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={saveExamResults} size="lg" className="px-8">
            <CheckCircle className="h-5 w-5 mr-2" />
            Save Exam Results
          </Button>
        </div>
      )}
    </div>
  )
}
