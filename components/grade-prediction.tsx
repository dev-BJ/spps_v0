"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, Target, AlertTriangle, Brain, Calendar, BookOpen, BarChart3 } from "lucide-react"
import { GradePredictionEngine, type PredictionResult } from "@/lib/grade-prediction"
import { useState, useEffect } from "react"

interface GradePredictionProps {
  subjectId: string
  subjectName: string
  currentData: any // This would come from your existing grade data
}

export function GradePrediction({ subjectId, subjectName, currentData }: GradePredictionProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generatePrediction = async () => {
      setLoading(true)

      // Transform your existing data to match the prediction engine format
      const predictionData = {
        currentGPA: currentData.percentage / 25, // Convert percentage to GPA scale
        assignments: currentData.assignments.map((a: any) => ({
          score: a.score,
          maxScore: a.maxScore,
          weight: a.weight,
          type: a.type,
          date: a.date,
          difficulty: Math.random() * 5 + 1, // Mock difficulty, would come from real data
        })),
        attendance: currentData.attendance,
        participationScore: 85, // Mock data - would come from real tracking
        studyHours: 8, // Mock data - would come from student input or tracking
        previousGrades: [85, 87, 84, 89, 91], // Mock historical data
        subjectDifficulty: 3, // Mock difficulty rating
        timeToFinals: 6, // Mock weeks to finals
        upcomingAssignments: [
          {
            name: "Midterm Exam",
            weight: 25,
            type: "Exam",
            difficulty: 4,
            dueDate: "2024-02-15",
          },
          {
            name: "Final Project",
            weight: 20,
            type: "Project",
            difficulty: 3,
            dueDate: "2024-02-28",
          },
        ],
      }

      const result = GradePredictionEngine.predictGrade(predictionData)
      setPrediction(result)
      setLoading(false)
    }

    generatePrediction()
  }, [currentData])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Brain className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing performance data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prediction) return null

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600"
    if (grade.startsWith("B")) return "text-blue-600"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-600" />
            AI Grade Prediction for {subjectName}
          </CardTitle>
          <CardDescription>Based on current performance trends and upcoming assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Predicted Final Grade</span>
              </div>
              <div className={`text-4xl font-bold ${getGradeColor(prediction.letterGrade)}`}>
                {prediction.letterGrade}
              </div>
              <div className="text-2xl font-semibold text-muted-foreground">{prediction.predictedFinalGrade}%</div>
              <div className="flex items-center justify-center mt-2">
                <span className="text-sm text-muted-foreground mr-2">Confidence:</span>
                <Badge variant="outline">{prediction.confidence}%</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                <span className="text-sm font-medium">Performance Trend</span>
              </div>
              <div className="flex items-center justify-center mb-2">
                {getTrendIcon(prediction.trendAnalysis.direction)}
                <span className="ml-2 font-semibold capitalize">{prediction.trendAnalysis.direction}</span>
              </div>
              <Progress value={prediction.trendAnalysis.strength * 100} className="h-2 mt-2" />
              <span className="text-xs text-muted-foreground">
                Trend Strength: {Math.round(prediction.trendAnalysis.strength * 100)}%
              </span>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-sm font-medium">Grade Scenarios</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Optimistic:</span>
                  <span className="font-medium">{prediction.scenarios.optimistic}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Realistic:</span>
                  <span className="font-medium">{prediction.scenarios.realistic}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Pessimistic:</span>
                  <span className="font-medium">{prediction.scenarios.pessimistic}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Alert */}
      {prediction.riskFactors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Risk Factors Identified:</strong>
            <ul className="list-disc list-inside mt-2">
              {prediction.riskFactors.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="probability" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="probability">Grade Probability</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="milestones">Key Milestones</TabsTrigger>
          <TabsTrigger value="analysis">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="probability">
          <Card>
            <CardHeader>
              <CardTitle>Grade Probability Distribution</CardTitle>
              <CardDescription>Likelihood of achieving each letter grade based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(prediction.probabilityDistribution)
                  .filter(([_, prob]) => prob > 0)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([grade, probability]) => (
                    <div key={grade} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge
                          variant={grade === prediction.letterGrade ? "default" : "outline"}
                          className="w-12 justify-center"
                        >
                          {grade}
                        </Badge>
                        <Progress value={probability} className="w-32 mx-4 h-2" />
                      </div>
                      <span className="text-sm font-medium">{probability}%</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>AI-generated suggestions to improve your grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <Badge variant={getPriorityColor(rec.priority)} className="mr-2">
                          {rec.priority}
                        </Badge>
                        <span className="font-medium capitalize">{rec.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-green-600 font-medium">+{rec.impact}% potential improvement</span>
                        <p className="text-xs text-muted-foreground">{rec.timeframe}</p>
                      </div>
                    </div>
                    <p className="text-sm">{rec.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Critical Milestones</CardTitle>
              <CardDescription>Key assignments that will significantly impact your final grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{milestone.assignment}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.impact}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {milestone.date}</p>
                        <Badge variant="outline">Target: {milestone.requiredScore}%</Badge>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={(milestone.requiredScore / 100) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Score {milestone.requiredScore}% or higher to stay on track
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Trend Analysis</CardTitle>
              <CardDescription>AI insights into your performance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Performance Trend</h4>
                  <div className="flex items-center mb-2">
                    {getTrendIcon(prediction.trendAnalysis.direction)}
                    <span className="ml-2 font-medium capitalize">
                      {prediction.trendAnalysis.direction} trend detected
                    </span>
                  </div>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {prediction.trendAnalysis.keyFactors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Consistent assignment submission</li>
                      <li>• Strong performance in recent quizzes</li>
                      <li>• Good attendance record</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Areas for Focus</h4>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• Exam preparation strategies</li>
                      <li>• Time management for projects</li>
                      <li>• Active participation in class</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button>
          <BookOpen className="h-4 w-4 mr-2" />
          Create Study Plan
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Set Grade Goals
        </Button>
        <Button variant="outline">Share with Advisor</Button>
      </div>
    </div>
  )
}
