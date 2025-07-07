"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Upload,
  CheckCircle,
  AlertTriangle,
  Download,
  Save,
  Users,
  Calculator,
  LogOut,
  BarChart3,
} from "lucide-react"
import { LecturerNavigation } from "@/components/lecturer-navigation"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ResultUploadForm } from "@/components/result-upload-form"
import { BulkUploadInterface } from "@/components/bulk-upload-interface"
import { GradeValidation } from "@/components/grade-validation"
import { ResultsPreview } from "@/components/results-preview"
import { ExamUploadInterface } from "@/components/exam-upload-interface"
import { ExamScheduleManager } from "@/components/exam-schedule-manager"
// import { getUser } from "@/lib/auth"

export default function UploadResultsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("individual")
  const [uploadedResults, setUploadedResults] = useState<any[]>([])
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
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
        setCourses(data?.courses || [])
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
      setLoading(false)
    }
    loadUser()
    fetch_courses()
  }, [router])

// console.log(courses)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleResultsUpload = (results: any[]) => {
    setUploadedResults(results)
    // Validate results
    const errors = validateResults(results)
    setValidationErrors(errors)
  }

  const validateResults = (results: any[]) => {
    const errors: any[] = []

    results.forEach((result, index) => {
      // Check for required fields
      if (!result.student_id) {
        errors.push({ row: index + 1, field: "studentId", message: "Student ID is required" })
      }
      if (!result.ca_score) {
        errors.push({ row: index + 1, field: "CA score", message: "CA score is required" })
      }
      if (!result.exam_score) {
        errors.push({ row: index + 1, field: "Exam score", message: "Exam score is required" })
      }
      if (result.total_score === undefined || result.total_score === null) {
        errors.push({ row: index + 1, field: "Total score", message: "Score is required" })
      }

      // Validate score range
      if (result.score < 0 || result.total_score > 100) {
        errors.push({
          row: index + 1,
          field: "Total score",
          message: `Score must be between 0 and ${result.total_score}`,
        })
      }

      // Check for duplicate entries
      // const duplicates = results.filter((r) => r.studentId === result.studentId && r.assignment === result.assignment)
      // if (duplicates.length > 1) {
      //   errors.push({
      //     row: index + 1,
      //     field: "duplicate",
      //     message: "Duplicate entry found",
      //   })
      // }
    })

    return errors
  }

  const handleSaveResults = async () => {
    if (validationErrors.length > 0) {
      alert("Please fix validation errors before saving")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call to save results
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      // console.log("API URL", process.env.NEXT_PUBLIC_API_URL)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save/result`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"results": uploadedResults})
      })
      .then(data => data.json())
      .then(data => {
        if(!data.success){
          alert("Error saving results. Please try again.")
        }
      })
      .catch((e)=>{
        console.log("Result upload error", e)
      })

      // Here you would make actual API calls to save the results
      // console.log("Saving results:", uploadedResults)

      alert("Results saved successfully!")
      setUploadedResults([])
      setValidationErrors([])
    } catch (error) {
      alert("Error saving results. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  // Mock data for lecturer's classes
  const lecturerClasses = [
    { id: "math101", name: "Mathematics 101", students: 32 },
    { id: "algebra", name: "Advanced Algebra", students: 28 },
    { id: "stats", name: "Statistics", students: 24 },
  ]

  const assignmentTypes = ["Quiz", "Test", "Exam", "Homework", "Project", "Lab Report", "Essay", "Presentation"]

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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Upload Student Results</h2>
              <p className="text-gray-600 mt-2">Add grades and feedback for your students</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              {uploadedResults.length > 0 && (
                <Button onClick={handleSaveResults} disabled={isProcessing || validationErrors.length > 0}>
                  <Save className="h-4 w-4 mr-2" />
                  {isProcessing ? "Saving..." : "Save Results"}
                </Button>
              )}
            </div>
          </div>

          <LecturerNavigation />

          {/* Upload Statistics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerClasses.length}</div>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerClasses.reduce((sum, cls) => sum + cls.students, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uploaded Today</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uploadedResults.length}</div>
                <p className="text-xs text-muted-foreground">Results pending save</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Validation Status</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {validationErrors.length === 0 && uploadedResults.length > 0 ? (
                    <span className="text-green-600">✓</span>
                  ) : validationErrors.length > 0 ? (
                    <span className="text-red-600">{validationErrors.length}</span>
                  ) : (
                    "-"
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {validationErrors.length === 0 && uploadedResults.length > 0
                    ? "All valid"
                    : validationErrors.length > 0
                      ? "Errors found"
                      : "No data"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Validation Errors Alert */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{validationErrors.length} validation error(s) found:</strong>
                <ul className="list-disc list-inside mt-2 max-h-32 overflow-y-auto">
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <li key={index}>
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                  {validationErrors.length > 5 && <li>... and {validationErrors.length - 5} more errors</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {uploadedResults.length > 0 && validationErrors.length === 0 && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Ready to save!</strong> {uploadedResults.length} results validated successfully.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="individual">Individual Entry</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
              <TabsTrigger value="exam">Exam Results</TabsTrigger>
              <TabsTrigger value="preview">Preview & Validate</TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <ResultUploadForm
                classes={courses}
                assignmentTypes={assignmentTypes}
                onResultAdd={(result) => {
                  setUploadedResults((prev) => [...prev, result])
                  handleResultsUpload([...uploadedResults, result])
                }}
              />
            </TabsContent>

            <TabsContent value="bulk">
              <BulkUploadInterface classes={courses} onResultsUpload={handleResultsUpload} />
            </TabsContent>

            <TabsContent value="exam">
              <Tabs defaultValue="upload" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload">Upload Results</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule Exams</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <ExamUploadInterface
                    classes={lecturerClasses}
                    onExamResultsUpload={(examData) => {
                      console.log("Exam results uploaded:", examData)
                      alert("Exam results processed successfully!")
                    }}
                  />
                </TabsContent>

                <TabsContent value="schedule">
                  <ExamScheduleManager classes={lecturerClasses} />
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No exam data available</p>
                    <p className="text-sm text-muted-foreground">Upload exam results to view analytics</p>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-6">
                <GradeValidation
                  results={uploadedResults}
                  errors={validationErrors}
                  onErrorsFix={(fixedResults) => {
                    setUploadedResults(fixedResults)
                    handleResultsUpload(fixedResults)
                  }}
                />

                <ResultsPreview
                  results={uploadedResults}
                  onResultEdit={(index, updatedResult) => {
                    const newResults = [...uploadedResults]
                    newResults[index] = updatedResult
                    setUploadedResults(newResults)
                    handleResultsUpload(newResults)
                  }}
                  onResultDelete={(index) => {
                    const newResults = uploadedResults.filter((_, i) => i !== index)
                    setUploadedResults(newResults)
                    handleResultsUpload(newResults)
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
