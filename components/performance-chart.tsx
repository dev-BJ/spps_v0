"use client"

export function PerformanceChart() {
  // Mock data for the chart
  const data = [
    { month: "Aug", gpa: 3.1, attendance: 88 },
    { month: "Sep", gpa: 3.2, attendance: 90 },
    { month: "Oct", gpa: 3.0, attendance: 85 },
    { month: "Nov", gpa: 3.3, attendance: 92 },
    { month: "Dec", gpa: 3.4, attendance: 89 },
    { month: "Jan", gpa: 3.42, attendance: 91 },
  ]

  const maxGPA = 4.0
  const maxAttendance = 100

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>GPA Trend</span>
        <span>Attendance Rate</span>
      </div>

      <div className="relative h-64 bg-gray-50 rounded-lg p-4">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="0" y1={200 - i * 40} x2="400" y2={200 - i * 40} stroke="#e5e7eb" strokeWidth="1" />
          ))}

          {/* GPA Line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={data.map((d, i) => `${i * 66.67 + 33.33},${200 - (d.gpa / maxGPA) * 160}`).join(" ")}
          />

          {/* Attendance Line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="5,5"
            points={data.map((d, i) => `${i * 66.67 + 33.33},${200 - (d.attendance / maxAttendance) * 160}`).join(" ")}
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={i * 66.67 + 33.33} cy={200 - (d.gpa / maxGPA) * 160} r="4" fill="#3b82f6" />
              <circle cx={i * 66.67 + 33.33} cy={200 - (d.attendance / maxAttendance) * 160} r="4" fill="#10b981" />
            </g>
          ))}

          {/* Month labels */}
          {data.map((d, i) => (
            <text key={i} x={i * 66.67 + 33.33} y="220" textAnchor="middle" fontSize="12" fill="#6b7280">
              {d.month}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
          <span>Average GPA</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-green-500 border-dashed mr-2"></div>
          <span>Attendance Rate</span>
        </div>
      </div>
    </div>
  )
}
