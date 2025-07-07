"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Search, Filter, Plus, LogOut } from "lucide-react"
import Link from "next/link"
import { StudentList } from "@/components/student-list"
import { AddStudentDialog } from "@/components/add-student-dialog"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
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
            <h2 className="text-3xl font-bold text-gray-900">Student Management</h2>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find students and filter by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">All Students</Badge>
                <Badge variant="outline">At Risk</Badge>
                <Badge variant="outline">High Performers</Badge>
                <Badge variant="outline">Grade 9</Badge>
                <Badge variant="outline">Grade 10</Badge>
                <Badge variant="outline">Grade 11</Badge>
                <Badge variant="outline">Grade 12</Badge>
              </div>
            </CardContent>
          </Card>

          <StudentList searchTerm={searchTerm} />
        </div>
      </main>

      <AddStudentDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
