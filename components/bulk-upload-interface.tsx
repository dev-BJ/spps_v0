"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileSpreadsheet, Download, AlertTriangle, CheckCircle, X } from "lucide-react"
import { getUser } from "@/lib/auth"

interface BulkUploadInterfaceProps {
  classes: Array<any>
  // classes: any[]
  onResultsUpload: (results: any[]) => void
}

export function BulkUploadInterface({ classes, onResultsUpload }: BulkUploadInterfaceProps) {
  const [selectedClass, setSelectedClass] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parseError, setParseError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  

  // console.log("Classes Data", classes)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setParseError("")

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      setParseError("Please upload a CSV or Excel file")
      return
    }

    // Process file
    processFile(file)
  }

  const processFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const text = await file.text()

      // Simulate processing progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Parse CSV
      const results = await parseCSV(text)
      // console.log(results)
      onResultsUpload(results)
    } catch (error) {
      setParseError("Error processing file. Please check the format.")
    } finally {
      setIsUploading(false)
    }
  }

  const parseCSV = async (csvText: string) => {
    const user = await getUser()
    const userId = user?.userId
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const results = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

      if (values.length !== headers.length) continue

      const result: any = {}
      headers.forEach((header, index) => {
        result[header.toLowerCase().replace(/\s+/g, "")] = values[index]
      })

      // Transform and validate data
      const transformedResult: any = {
        course_code: String(selectedClass),
        lecturer_id: String(userId),
        student_id: String(result.studentid || result.student_id || result.id),
        semester: String(result.semester),
        session: String(result.session),
        course_unit: Number.parseInt(result.course_unit || result.courseUnit || result.courseunit),
        ca_score: Number.parseInt(result.ca_score || result.caScore || result.cascore),
        exam_score: Number.parseInt(result.exam_score || result.examScore || result.examscore) || 0,
        total_score: Number.parseInt(result.totalscore || result.total_score || result.totalScore) || 100,
      }

      // Calculate derived fields
      transformedResult.percentage = Number.parseInt((Number.parseInt(transformedResult.total_score) / 100) * 100)
      const meta_info = calculateMeta(transformedResult.percentage)
      transformedResult.weight = meta_info.weight
      transformedResult.letter_grade = meta_info.letter_grade

      results.push(transformedResult)
    }

    return results
  }

  const calculateMeta = (percentage: number): {weight: number, letter_grade: string} => {
    if (percentage >= 75) return {"weight": 4.00, "letter_grade": "A"}
    if (percentage >= 70) return {"weight": 3.50, "letter_grade": "AB"}
    if (percentage >= 65) return {"weight": 3.25, "letter_grade": "B"}
    if (percentage >= 60) return {"weight": 3.00, "letter_grade": "BC"}
    if (percentage >= 55) return {"weight": 2.75, "letter_grade": "C"}
    if (percentage >= 50) return {"weight": 2.50, "letter_grade": "CD"}
    if (percentage >= 45) return {"weight": 2.25, "letter_grade": "D"}
    if (percentage >= 40) return {"weight": 2.00, "letter_grade": "E"}
    return {"weight": 0.00, "letter_grade": "F"}
  }

  const downloadTemplate = () => {
    const template = `Student ID,Semester,Session,Course Unit,CA Score,Exam Score,Total Score
15h/0001/cs,1st,20/21,2,12,68,80
15h/0001/cs,1st,20/21,1,15,55,70
15h/0001/cs,1st,20/21,2,22,34,56
15h/0001/cs,1st,20/21,1,13,69,82
15h/0001/cs,1st,20/21,2,16,56,72
15h/0001/cs,1st,20/21,1,23,35,58
15h/0001/cs,1st,20/21,1,14,70,84
15h/0001/cs,1st,20/21,1,17,57,74
15h/0001/cs,1st,20/21,2,24,36,60
15h/0001/cs,1st,20/21,2,15,71,86
15h/0001/cs,1st,20/21,2,18,58,76`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "grade_upload_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFile = () => {
    setUploadedFile(null)
    setParseError("")
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
          <CardDescription>Choose the class for which you're uploading results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
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
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Results File</CardTitle>
          <CardDescription>
            Upload a CSV or Excel file with student results. Make sure to select a class first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">Need a template?</h4>
                <p className="text-sm text-blue-700">Download our CSV template to get started</p>
              </div>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!uploadedFile ? (
                <div>
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload your results file</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your CSV or Excel file here, or click to browse
                    </p>
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="mt-4 max-w-xs mx-auto"
                    disabled={!selectedClass}
                  />
                  {!selectedClass && <p className="text-sm text-red-600 mt-2">Please select a class first</p>}
                </div>
              ) : (
                <div>
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">File uploaded successfully</p>
                    <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button variant="outline" onClick={clearFile} className="mt-4 bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Remove File
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Parse Error */}
            {parseError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Format Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>File Format Guidelines</CardTitle>
          <CardDescription>Follow these guidelines for successful upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  • <strong>Student ID</strong>
                </li>
                <li>
                  • <strong>Semester</strong> 
                </li>
                <li>
                  • <strong>Session</strong> 
                </li>
                <li>
                  • <strong>Course Unit</strong> 
                </li>
                <li>
                  • <strong>CA Score</strong> 
                </li>
                <li>
                  • <strong>Exam Score</strong> 
                </li>
                <li>
                  • <strong>Total Score</strong> 
                </li>
              </ul>
            </div>

            {/* <div>
              <h4 className="font-medium mb-2">Optional Columns:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Student Name, Assignment Type, Weight, Due Date</li>
                <li>• Feedback, Late Submission, Attempts</li>
              </ul>
            </div> */}

            <div>
              <h4 className="font-medium mb-2">Tips:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use CSV format for best compatibility</li>
                <li>• Ensure all scores are numeric values</li>
                <li>• Student IDs should match your class roster</li>
                <li>• Remove any empty rows at the end of the file</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
