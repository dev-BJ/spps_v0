"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Clock } from "lucide-react"

export function RiskAssessment() {
  const riskStudents = [
    {
      name: "Bob Smith",
      riskScore: 85,
      factors: ["Low GPA", "Poor Attendance", "Missing Assignments"],
      trend: "increasing",
    },
    {
      name: "Lisa Chen",
      riskScore: 72,
      factors: ["Declining Grades", "Behavioral Issues"],
      trend: "stable",
    },
    {
      name: "Mike Rodriguez",
      riskScore: 68,
      factors: ["Attendance Issues", "Family Problems"],
      trend: "decreasing",
    },
    {
      name: "Emma Wilson",
      riskScore: 61,
      factors: ["Subject Struggles", "Low Participation"],
      trend: "stable",
    },
  ]

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "destructive" }
    if (score >= 60) return { level: "High", color: "secondary" }
    if (score >= 40) return { level: "Medium", color: "outline" }
    return { level: "Low", color: "default" }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <AlertTriangle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-4">
      {riskStudents.map((student, index) => {
        const risk = getRiskLevel(student.riskScore)
        return (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{student.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={risk.color}>{risk.level} Risk</Badge>
                  {getTrendIcon(student.trend)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{student.riskScore}</p>
                <p className="text-xs text-muted-foreground">Risk Score</p>
              </div>
            </div>

            <Progress value={student.riskScore} className="h-2" />

            <div>
              <p className="text-sm font-medium mb-2">Risk Factors:</p>
              <div className="flex flex-wrap gap-1">
                {student.factors.map((factor, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      <div className="p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
          <h4 className="font-semibold text-orange-900">Intervention Recommendations</h4>
        </div>
        <ul className="text-orange-800 text-sm space-y-1">
          <li>• Schedule immediate meetings with critical risk students</li>
          <li>• Implement personalized learning plans for high-risk students</li>
          <li>• Increase monitoring frequency for all at-risk students</li>
          <li>• Consider family engagement programs</li>
        </ul>
      </div>
    </div>
  )
}
