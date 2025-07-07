"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, CheckCircle } from "lucide-react"

export function PredictionAnalytics() {
  // Mock prediction data
  const predictions = [
    {
      category: "Overall Class Performance",
      predicted: 3.2,
      current: 3.1,
      confidence: 87,
      trend: "up",
    },
    {
      category: "At-Risk Students",
      predicted: 42,
      current: 47,
      confidence: 92,
      trend: "down",
    },
    {
      category: "Graduation Rate",
      predicted: 94.8,
      current: 94.2,
      confidence: 89,
      trend: "up",
    },
  ]

  const modelMetrics = {
    accuracy: 89,
    precision: 85,
    recall: 91,
    f1Score: 88,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {predictions.map((prediction, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">{prediction.category}</h4>
              {prediction.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Current: {prediction.current}</span>
              <span className="font-medium">Predicted: {prediction.predicted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <span className="text-sm font-medium">{prediction.confidence}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2 mt-1" />
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Performance Metrics</CardTitle>
          <CardDescription>Statistical accuracy of the prediction model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{modelMetrics.accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{modelMetrics.precision}%</p>
              <p className="text-sm text-muted-foreground">Precision</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{modelMetrics.recall}%</p>
              <p className="text-sm text-muted-foreground">Recall</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{modelMetrics.f1Score}%</p>
              <p className="text-sm text-muted-foreground">F1 Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-900">Model Status</h4>
        </div>
        <p className="text-blue-800 text-sm">
          The prediction model was last updated 2 hours ago and is performing within expected parameters. Next scheduled
          update: Tomorrow at 6:00 AM.
        </p>
      </div>
    </div>
  )
}
