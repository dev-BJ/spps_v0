"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface ExamAnalyticsDashboardProps {
  examData: any
}

export function ExamAnalyticsDashboard({ examData }: ExamAnalyticsDashboardProps) {
  const { examDetails, questions, studentResults, stats } = examData

  const gradeDistribution = {
    "A+": studentResults.filter((s: any) => s.grade === "A+").length,
    A: studentResults.filter((s: any) => s.grade === "A").length,
    "B+": studentResults.filter((s: any) => s.grade === "B+").length,
    B: studentResults.filter((s: any) => s.grade === "B").length,
    C: studentResults.filter((s: any) => s.grade === "C").length,
    D: studentResults.filter((s: any) => s.grade === "D").length,
    F: studentResults.filter((s: any) => s.grade === "F").length,
  }

  const questionAnalysis = questions.map((q: any) => {
    const scores = studentResults
      .filter((s: any) => s.status === "present")
      .map((s: any) => s.questionScores.find((qs: any) => qs.questionId === q.id)?.score || 0)

    return {
      ...q,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      maxScore: Math.max(...scores),
      minScore: Math.min(...scores),
      difficulty: scores.reduce((sum, score) => sum + score, 0) / scores.length / q.marks,
      discrimination: calculateDiscrimination(scores),
    }
  })

  function calculateDiscrimination(scores: number[]) {
    // Simple discrimination index calculation
    const sortedScores = [...scores].sort((a, b) => b - a)
    const topThird = sortedScores.slice(0, Math.floor(scores.length / 3))
    const bottomThird = sortedScores.slice(-Math.floor(scores.length / 3))

    const topAvg = topThird.reduce((sum, score) => sum + score, 0) / topThird.length
    const bottomAvg = bottomThird.reduce((sum, score) => sum + score, 0) / bottomThird.length

    return (topAvg - bottomAvg) / Math.max(...scores)
  }

  return (
    <div className="space-y-6">
      {/* Exam Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            {examDetails.examName} - Analytics
          </CardTitle>
          <CardDescription>
            {examDetails.examType} • {examDetails.examDate} • {examDetails.duration} minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.presentStudents}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.passedStudents}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.passPercentage.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Pass Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Pass Rate</span>
                    <span>{stats.passPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.passPercentage} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Attendance Rate</span>
                    <span>{((stats.presentStudents / stats.totalStudents) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.presentStudents / stats.totalStudents) * 100} className="h-3" />
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">{stats.highestScore.toFixed(1)}%</div>
                    <div className="text-sm text-green-600">Highest Score</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-700">{stats.lowestScore.toFixed(1)}%</div>
                    <div className="text-sm text-red-600">Lowest Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentResults
                    .filter((s: any) => s.status === "present")
                    .sort((a: any, b: any) => b.percentage - a.percentage)
                    .slice(0, 5)
                    .map((student: any, index: number) => (
                      <div key={student.studentId} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <div>
                            <div className="font-medium">{student.studentName}</div>
                            <div className="text-sm text-muted-foreground">{student.studentId}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{student.percentage.toFixed(1)}%</div>
                          <Badge variant="default">{student.grade}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Question-wise Analysis</CardTitle>
              <CardDescription>Performance breakdown for each question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionAnalysis.map((q: any, index: number) => (
                  <div key={q.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">{q.question || "No description"}</p>
                        <Badge variant="outline" className="mt-1">
                          {q.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{q.marks} marks</div>
                        <div className="text-sm text-muted-foreground">
                          Avg: {q.averageScore.toFixed(1)}/{q.marks}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="text-sm font-medium mb-1">Difficulty Index</div>
                        <div className="flex items-center space-x-2">
                          <Progress value={q.difficulty * 100} className="flex-1 h-2" />
                          <span className="text-sm">{(q.difficulty * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {q.difficulty > 0.8 ? "Easy" : q.difficulty > 0.5 ? "Medium" : "Hard"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">Discrimination</div>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.abs(q.discrimination) * 100} className="flex-1 h-2" />
                          <span className="text-sm">{q.discrimination.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.abs(q.discrimination) > 0.3 ? "Good" : "Needs Review"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">Score Range</div>
                        <div className="text-sm">
                          {q.minScore} - {q.maxScore} / {q.marks}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Min - Max scores</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Distribution of grades across the class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          grade.startsWith("A")
                            ? "default"
                            : grade.startsWith("B")
                              ? "secondary"
                              : grade === "F"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {grade}
                      </Badge>
                      <span className="font-medium">{count} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={(count / stats.presentStudents) * 100} className="w-32 h-2" />
                      <span className="text-sm text-muted-foreground">
                        {((count / stats.presentStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.passPercentage < 60 && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        <h4 className="font-semibold text-red-900">Low Pass Rate Alert</h4>
                      </div>
                      <p className="text-red-800 text-sm">
                        Only {stats.passPercentage.toFixed(1)}% of students passed. Consider reviewing exam difficulty
                        or providing additional support.
                      </p>
                    </div>
                  )}

                  {stats.averageScore > 85 && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-green-900">Excellent Performance</h4>
                      </div>
                      <p className="text-green-800 text-sm">
                        Class average of {stats.averageScore.toFixed(1)}% indicates strong understanding of the
                        material.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      {questionAnalysis.filter((q: any) => q.difficulty < 0.3).length > 0 && (
                        <li>• Review difficult questions with low average scores</li>
                      )}
                      {stats.absentStudents > 0 && (
                        <li>• Follow up with {stats.absentStudents} absent students for makeup exam</li>
                      )}
                      {stats.failedStudents > 0 && (
                        <li>• Provide additional support for {stats.failedStudents} students who didn't pass</li>
                      )}
                      <li>• Consider the exam results when planning future lessons</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
