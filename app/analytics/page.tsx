"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Download, RefreshCw, LogOut } from "lucide-react"
import Link from "next/link"
import { PredictionAnalytics } from "@/components/prediction-analytics"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { RiskAssessment } from "@/components/risk-assessment"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getUser()
      if (!currentUser || currentUser.role !== "lecturer") {
        router.push("/login")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    loadUser()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">EduPredict</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/lecturer/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/lecturer/students">
                <Button variant="ghost">Students</Button>
              </Link>
              <Link href="/lecturer/analytics">
                <Button variant="ghost">Analytics</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Rest of the component remains the same */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Prediction Model</CardTitle>
                <CardDescription>AI-powered predictions for student outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionAnalytics />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Students at risk of academic failure</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskAssessment />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>Comprehensive analysis of student performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceMetrics />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
