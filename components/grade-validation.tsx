"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react"

interface GradeValidationProps {
  results: any[]
  errors: any[]
  onErrorsFix: (fixedResults: any[]) => void
}

export function GradeValidation({ results, errors, onErrorsFix }: GradeValidationProps) {
  const validResults = results.length - errors.length
  const validationRate = results.length > 0 ? (validResults / results.length) * 100 : 0

  const errorsByType = errors.reduce(
    (acc, error) => {
      acc[error.field] = (acc[error.field] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const autoFixErrors = () => {
    const fixedResults = results.map((result, index) => {
      const resultErrors = errors.filter((e) => e.row === index + 1)
      const fixed = { ...result }

      resultErrors.forEach((error) => {
        switch (error.field) {
          case "score":
            // Cap score at max score
            if (fixed.score > fixed.max_score) {
              fixed.score = fixed.max_score
            }
            // Ensure score is not negative
            if (fixed.score < 0) {
              fixed.score = 0
            }
            break
          case "studentId":
            // Generate a placeholder ID if missing
            if (!fixed.studentId) {
              fixed.studentId = `STU${String(index + 1).padStart(3, "0")}`
            }
            break
          case "assignment":
            // Generate a placeholder assignment name if missing
            if (!fixed.assignment) {
              fixed.assignment = `Assignment ${index + 1}`
            }
            break
        }
      })

      // Recalculate derived fields
      fixed.percentage = (fixed.score / fixed.maxScore) * 100
      fixed.letterGrade = calculateLetterGrade(fixed.percentage)

      return fixed
    })

    onErrorsFix(fixedResults)
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

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No results to validate</p>
            <p className="text-sm text-muted-foreground">Upload some results first</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {errors.length === 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            )}
            Validation Results
          </CardTitle>
          <CardDescription>
            {results.length} results processed, {validResults} valid, {errors.length} errors found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Validation Progress</span>
                <span>{validationRate.toFixed(1)}%</span>
              </div>
              <Progress value={validationRate} className="h-3" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{validResults}</div>
                <div className="text-sm text-green-600">Valid Results</div>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">{errors.length}</div>
                <div className="text-sm text-red-600">Errors Found</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{results.length}</div>
                <div className="text-sm text-blue-600">Total Results</div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="flex justify-center">
                <Button onClick={autoFixErrors} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Auto-Fix Common Errors
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Details */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
            <CardDescription>Review and fix these issues before saving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Error Summary by Type */}
              <div>
                <h4 className="font-medium mb-3">Errors by Type</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(errorsByType).map(([type, count]) => (
                    <Badge key={type} variant="destructive">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Detailed Error List */}
              <div>
                <h4 className="font-medium mb-3">Detailed Errors</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Row {error.row}:</strong> {error.message}
                        {error.field && (
                          <Badge variant="outline" className="ml-2">
                            {error.field}
                          </Badge>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {errors.length === 0 && results.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>All results validated successfully!</strong> You can now save the results to the system.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
