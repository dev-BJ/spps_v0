"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, BookOpen, Calendar, Award } from "lucide-react"

export function PerformanceMetrics() {
  const metrics = [
    {
      category: "Academic Performance",
      icon: <BookOpen className="h-5 w-5" />,
      metrics: [
        { name: "Average GPA", value: 3.42, target: 3.5, trend: "up", unit: "" },
        { name: "Pass Rate", value: 94.2, target: 95, trend: "up", unit: "%" },
        { name: "Honor Roll Students", value: 28, target: 30, trend: "stable", unit: "%" },
      ],
    },
    {
      category: "Attendance & Engagement",
      icon: <Calendar className="h-5 w-5" />,
      metrics: [
        { name: "Average Attendance", value: 91.3, target: 95, trend: "down", unit: "%" },
        { name: "Chronic Absenteeism", value: 8.7, target: 5, trend: "up", unit: "%" },
        { name: "Class Participation", value: 82.5, target: 85, trend: "up", unit: "%" },
      ],
    },
    {
      category: "Student Outcomes",
      icon: <Award className="h-5 w-5" />,
      metrics: [
        { name: "Graduation Rate", value: 94.2, target: 96, trend: "up", unit: "%" },
        { name: "College Readiness", value: 78.3, target: 80, trend: "up", unit: "%" },
        { name: "Career Readiness", value: 85.1, target: 85, trend: "stable", unit: "%" },
      ],
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 95) return "bg-green-500"
    if (percentage >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {metrics.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {category.icon}
              <span>{category.category}</span>
            </CardTitle>
            <CardDescription>Key performance indicators and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {category.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold">
                        {metric.value}
                        {metric.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>
                          {metric.target}
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        metric.value >= metric.target
                          ? "default"
                          : metric.value >= metric.target * 0.9
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {metric.value >= metric.target
                        ? "On Target"
                        : metric.value >= metric.target * 0.9
                          ? "Near Target"
                          : "Below Target"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {metric.trend === "up" ? "↗ Improving" : metric.trend === "down" ? "↘ Declining" : "→ Stable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Predictive Insights</span>
          </CardTitle>
          <CardDescription>AI-powered predictions and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">End-of-Year Projections</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Expected graduation rate: 95.1% (+0.9%)</li>
                <li>• Projected average GPA: 3.48 (+0.06)</li>
                <li>• At-risk students likely to improve: 23</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Success Factors</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Strong teacher-student ratios</li>
                <li>• Effective intervention programs</li>
                <li>• High family engagement levels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
