"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react"

interface ExamScheduleManagerProps {
  classes: Array<{ id: string; name: string; students: number }>
}

export function ExamScheduleManager({ classes }: ExamScheduleManagerProps) {
  const [scheduledExams, setScheduledExams] = useState([
    {
      id: 1,
      examName: "Midterm Exam - Algebra",
      classId: "math101",
      className: "Mathematics 101",
      date: "2024-02-15",
      startTime: "09:00",
      duration: 120,
      venue: "Room A-101",
      totalMarks: 100,
      status: "scheduled",
    },
    {
      id: 2,
      examName: "Unit Test - Calculus",
      classId: "algebra",
      className: "Advanced Algebra",
      date: "2024-02-18",
      startTime: "14:00",
      duration: 90,
      venue: "Room B-205",
      totalMarks: 75,
      status: "scheduled",
    },
  ])

  const [newExam, setNewExam] = useState({
    examName: "",
    classId: "",
    date: "",
    startTime: "",
    duration: "",
    venue: "",
    totalMarks: "100",
    instructions: "",
  })

  const [editingExam, setEditingExam] = useState<number | null>(null)

  const handleAddExam = () => {
    if (!newExam.examName || !newExam.classId || !newExam.date) {
      alert("Please fill in required fields")
      return
    }

    const selectedClass = classes.find((c) => c.id === newExam.classId)
    const exam = {
      id: Date.now(),
      ...newExam,
      className: selectedClass?.name || "",
      duration: Number(newExam.duration),
      totalMarks: Number(newExam.totalMarks),
      status: "scheduled",
    }

    setScheduledExams([...scheduledExams, exam])
    setNewExam({
      examName: "",
      classId: "",
      date: "",
      startTime: "",
      duration: "",
      venue: "",
      totalMarks: "100",
      instructions: "",
    })
  }

  const handleDeleteExam = (id: number) => {
    setScheduledExams(scheduledExams.filter((exam) => exam.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      case "ongoing":
        return <Badge variant="default">Ongoing</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Add New Exam */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Schedule New Exam
          </CardTitle>
          <CardDescription>Create a new exam schedule for your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name *</Label>
              <Input
                id="examName"
                value={newExam.examName}
                onChange={(e) => setNewExam((prev) => ({ ...prev, examName: e.target.value }))}
                placeholder="e.g., Midterm Exam - Chapter 1-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select
                value={newExam.classId}
                onValueChange={(value) => setNewExam((prev) => ({ ...prev, classId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.students} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Exam Date *</Label>
              <Input
                id="date"
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newExam.startTime}
                onChange={(e) => setNewExam((prev) => ({ ...prev, startTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newExam.duration}
                onChange={(e) => setNewExam((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={newExam.venue}
                onChange={(e) => setNewExam((prev) => ({ ...prev, venue: e.target.value }))}
                placeholder="Room A-101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                value={newExam.totalMarks}
                onChange={(e) => setNewExam((prev) => ({ ...prev, totalMarks: e.target.value }))}
                placeholder="100"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleAddExam} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Exam
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Scheduled Exams
          </CardTitle>
          <CardDescription>Manage your upcoming and past exams</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledExams.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No exams scheduled</p>
              <p className="text-sm text-muted-foreground">Create your first exam schedule above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledExams.map((exam) => (
                <div key={exam.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{exam.examName}</h3>
                      <p className="text-sm text-muted-foreground">{exam.className}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(exam.status)}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{new Date(exam.date).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">Date</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{exam.startTime ? formatTime(exam.startTime) : "TBD"}</div>
                        <div className="text-sm text-muted-foreground">{exam.duration} minutes</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{exam.venue || "TBD"}</div>
                        <div className="text-sm text-muted-foreground">Venue</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{exam.totalMarks} marks</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Upload Results
                    </Button>
                    <Button size="sm" variant="outline">
                      Generate Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
