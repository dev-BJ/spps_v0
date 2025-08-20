"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle } from "lucide-react"
import { GradePrediction } from "./grade-prediction"
import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import 'chart.js/auto'

interface PredictionDashboardProps {
  advisory: {response: string, current_gpa: number, predicted_gpa: number} | null
  // current_gpa: number
  // predicted_gpa: number
  // response: string
}

export function AdvisoryDashboard({ advisory }: PredictionDashboardProps) {

  const data = {
    labels: ['Current GPA', 'Predicted GPA'],
    datasets: [
      {
        label: 'GPA',
        data: [advisory?.current_gpa || 0, advisory?.predicted_gpa || 0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  }
  useEffect(() => {
    // This effect can be used to fetch or update data when the component mounts
    // For example, you can fetch the latest predictions or recommendations here
    // console.log("Response", advisory?.response)
  }, [])

  function cleanRecommendation(text: any) {
  // Remove all asterisks
  let cleaned = text.replace(/\*/g, '');
  // Replace all escaped \n with real line breaks
  cleaned = cleaned.replace(/\\n/g, '\r\n');
  // Ensure a blank line before each numbered list item (e.g., 1., 2., etc.)
  cleaned = cleaned.replace(/(\n)(\d+\.)/g, '\r\n$2');
  // Trim leading/trailing whitespace
  // console.log("Cleaned Recommendation", cleaned.split('\r\n'))
  return cleaned.split('\r\n')
  // console.log("Recommendation", recommendation)
  // Return the cleaned text
}

  return (
    <div className="space-y-5">
      {/* Subject-wise Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>CGPA Prediction and Recommendations</CardTitle>
          <CardDescription>AI predictions and recommendations on how to improve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1">
            <div
                className="p-4 flex justify-content border rounded-lg shadow-md"
              >
                <div className="w-1/2 p-4">
                  <Bar data={data} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Current vs Predicted GPA'
                      }
                    }
                  }} />
                </div>
                <div className="w-1/2 p4 text-center">
                {
                  cleanRecommendation(advisory?.response || "No results yet").map((item) => {
                    return <p className='text-sm text-gray-800'>{item.trim()}</p>
                  })
                }
                </div>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions
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
      </Card> */}
    </div>
  )
}
