"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Subject {
  name: string
  currentGrade: string
  percentage: number
  trend: string
}

interface SemesterData {
  semester: string
  gpa: number
  credits: number
}

interface GradeChartProps {
  subjects: Subject[]
  semesterHistory: SemesterData[]
}

export function GradeChart({ subjects, semesterHistory }: GradeChartProps) {
  // Mock grade progression data
  const gradeProgression = [
    { month: "Sep", math: 85, english: 88, science: 92, history: 80, art: 95 },
    { month: "Oct", math: 83, english: 90, science: 94, history: 78, art: 96 },
    { month: "Nov", math: 86, english: 89, science: 93, history: 82, art: 97 },
    { month: "Dec", math: 87, english: 91, science: 95, history: 83, art: 97 },
    { month: "Jan", math: 88, english: 91, science: 95, history: 83, art: 97 },
  ]

  const subjectColors = {
    math: "#3b82f6",
    english: "#10b981",
    science: "#f59e0b",
    history: "#ef4444",
    art: "#8b5cf6",
  }

  return (
    <div className="space-y-6">
      {/* GPA Trend */}
      <Card>
        <CardHeader>
          <CardTitle>GPA Trend Over Time</CardTitle>
          <CardDescription>Your academic performance across semesters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {semesterHistory.map((semester, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{semester.semester}</p>
                  <p className="text-sm text-muted-foreground">{semester.credits} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{semester.gpa}</p>
                  <p className="text-sm text-muted-foreground">GPA</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Over Time</CardTitle>
          <CardDescription>Monthly grade progression for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-80 bg-gray-50 rounded-lg p-4">
            <svg width="100%" height="100%" viewBox="0 0 500 300" className="overflow-visible">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line key={i} x1="50" y1={50 + i * 40} x2="450" y2={50 + i * 40} stroke="#e5e7eb" strokeWidth="1" />
              ))}
              {gradeProgression.map((_, i) => (
                <line key={i} x1={50 + i * 80} y1="50" x2={50 + i * 80} y2="250" stroke="#e5e7eb" strokeWidth="1" />
              ))}

              {/* Subject lines */}
              {Object.entries(subjectColors).map(([subject, color]) => (
                <polyline
                  key={subject}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  points={gradeProgression
                    .map((d, i) => `${50 + i * 80},${250 - ((d[subject as keyof typeof d] as number) - 70) * 4}`)
                    .join(" ")}
                />
              ))}

              {/* Data points */}
              {gradeProgression.map((d, i) =>
                Object.entries(subjectColors).map(([subject, color]) => (
                  <circle
                    key={`${subject}-${i}`}
                    cx={50 + i * 80}
                    cy={250 - ((d[subject as keyof typeof d] as number) - 70) * 4}
                    r="3"
                    fill={color}
                  />
                )),
              )}

              {/* Month labels */}
              {gradeProgression.map((d, i) => (
                <text key={i} x={50 + i * 80} y="270" textAnchor="middle" fontSize="12" fill="#6b7280">
                  {d.month}
                </text>
              ))}

              {/* Y-axis labels */}
              {[70, 80, 90, 100].map((grade, i) => (
                <text key={grade} x="40" y={250 - i * 40} textAnchor="end" fontSize="12" fill="#6b7280">
                  {grade}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mt-4">
            {Object.entries(subjectColors).map(([subject, color]) => (
              <div key={subject} className="flex items-center">
                <div className="w-4 h-0.5 mr-2" style={{ backgroundColor: color }}></div>
                <span className="text-sm capitalize">{subject}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Insights into your academic trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Consistent performance in Visual Arts (A+ average)</li>
                <li>• Strong improvement in Biology this semester</li>
                <li>• Excellent attendance across all subjects</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Areas for Improvement</h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• World History showing declining trend</li>
                <li>• Mathematics could benefit from more consistent scores</li>
                <li>• Consider additional study time for challenging subjects</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
