"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle } from "lucide-react"
import { GradePrediction } from "./grade-prediction"
import { useState } from "react"

interface PredictionDashboardProps {
  subjects: any[]
}

export function PredictionDashboard({ subjects }: PredictionDashboardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  // Mock overall predictions summary
  const overallPrediction = {
    predictedGPA: 3.45,
    currentGPA: 3.42,
    trend: "improving",
    confidence: 87,
    atRiskSubjects: subjects.filter((s) => s.percentage < 75).length,
    improvingSubjects: subjects.filter((s) => s.trend === "up").length,
  }

  if (selectedSubject) {
    const subject = subjects.find((s) => s.id === selectedSubject)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Grade Prediction: {subject?.name}</h3>
          <Button variant="outline" onClick={() => setSelectedSubject(null)}>
            Back to Overview
          </Button>
        </div>
        <GradePrediction subjectId={selectedSubject} subjectName={subject?.name || ""} currentData={subject} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Prediction Summary */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            Overall Academic Prediction
          </CardTitle>
          <CardDescription>AI analysis of your complete academic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-blue-600 mr-1" />
                <span className="text-sm font-medium">Predicted GPA</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{overallPrediction.predictedGPA}</div>
              <div className="text-sm text-muted-foreground">Current: {overallPrediction.currentGPA}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
                <span className="text-sm font-medium">Trend</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {overallPrediction.trend}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">{overallPrediction.confidence}% confidence</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-1" />
                <span className="text-sm font-medium">At Risk</span>
              </div>
              <div className="text-3xl font-bold text-red-600">{overallPrediction.atRiskSubjects}</div>
              <div className="text-sm text-muted-foreground">subjects</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                <span className="text-sm font-medium">Improving</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{overallPrediction.improvingSubjects}</div>
              <div className="text-sm text-muted-foreground">subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Grade Predictions</CardTitle>
          <CardDescription>Click on any subject to see detailed AI predictions and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSubject(subject.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{subject.name}</h4>
                    <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                  </div>
                  <Badge variant="outline">{subject.currentGrade}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current:</span>
                    <span className="font-medium">{subject.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Predicted:</span>
                    <span className="font-medium text-blue-600">
                      {(subject.percentage + (subject.trend === "up" ? 3 : subject.trend === "down" ? -2 : 0)).toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center">
                    {subject.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                    {subject.trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />}
                    <span className="text-xs text-muted-foreground capitalize">{subject.trend} trend</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Study Recommendations</CardTitle>
          <CardDescription>Personalized suggestions based on your performance patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Priority Focus</h4>
              <p className="text-blue-800 text-sm mb-3">
                Focus on World History - showing declining trend with upcoming major exam
              </p>
              <Button size="sm" className="w-full">
                Create Study Plan
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Maintain Momentum</h4>
              <p className="text-green-800 text-sm mb-3">Keep up excellent work in Biology and Visual Arts</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                View Strategies
              </Button>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Attendance Alert</h4>
              <p className="text-yellow-800 text-sm mb-3">Improve attendance in Mathematics to boost performance</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Set Reminders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
