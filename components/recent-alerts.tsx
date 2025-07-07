import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, User } from "lucide-react"

export function RecentAlerts() {
  const alerts = [
    {
      id: 1,
      student: "Bob Smith",
      type: "Academic Risk",
      message: "GPA dropped below 2.5 threshold",
      severity: "high",
      time: "2 hours ago",
    },
    {
      id: 2,
      student: "Emma Brown",
      type: "Attendance",
      message: "Missed 3 consecutive days",
      severity: "medium",
      time: "1 day ago",
    },
    {
      id: 3,
      student: "Mike Johnson",
      type: "Assignment",
      message: "Multiple overdue assignments",
      severity: "medium",
      time: "2 days ago",
    },
    {
      id: 4,
      student: "Sarah Davis",
      type: "Behavior",
      message: "Improvement in participation noted",
      severity: "low",
      time: "3 days ago",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <div className="flex-shrink-0 mt-1">{getSeverityIcon(alert.severity)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">{alert.student}</p>
              <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                {alert.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{alert.message}</p>
            <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
