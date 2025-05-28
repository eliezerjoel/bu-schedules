"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, BookOpen, RefreshCw, Plus, Edit, FileText, Download } from "lucide-react"
import { PDFExportButton } from "./pdf-export"

export function LecturerDashboard() {
  const [viewMode, setViewMode] = useState("calendar") // "list" or "calendar"

  // Sample lecturer data - in real app this would come from authentication
  const lecturerInfo = {
    name: "Dr. Sarah Nakato",
    department: "School of Science & Technology",
    employeeId: "BU2019001",
    email: "s.nakato@bugema.ac.ug",
    semester: "Semester 1, 2024/2025",
  }

  // Sample lecturer's classes - in real app this would come from API
  const lecturerClasses = [
    {
      id: 1,
      courseCode: "CSC 2101",
      courseName: "Data Structures and Algorithms",
      program: "Bachelor of Computer Science",
      year: "Year 2",
      day: "Monday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      students: 45,
      credits: 3,
    },
    {
      id: 2,
      courseCode: "CSC 3201",
      courseName: "Advanced Algorithms",
      program: "Bachelor of Computer Science",
      year: "Year 3",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      students: 32,
      credits: 4,
    },
    {
      id: 3,
      courseCode: "CSC 2101",
      courseName: "Data Structures and Algorithms",
      program: "Bachelor of Computer Science",
      year: "Year 2",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "17:00",
      type: "Practical",
      students: 45,
      credits: 3,
    },
    {
      id: 4,
      courseCode: "CSC 1101",
      courseName: "Introduction to Programming",
      program: "Bachelor of Computer Science",
      year: "Year 1",
      day: "Thursday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      students: 60,
      credits: 4,
    },
    {
      id: 5,
      courseCode: "CSC 3201",
      courseName: "Advanced Algorithms",
      program: "Bachelor of Computer Science",
      year: "Year 3",
      day: "Friday",
      startTime: "10:00",
      endTime: "13:00",
      type: "Practical",
      students: 32,
      credits: 4,
    },
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const getTypeColor = (type) => {
    switch (type) {
      case "Lecture":
        return "bg-blue-100 text-blue-800"
      case "Practical":
        return "bg-green-100 text-green-800"
      case "Tutorial":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 7; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const getClassPosition = (startTime, endTime) => {
    const startHour = Number.parseInt(startTime.split(":")[0])
    const startMinute = Number.parseInt(startTime.split(":")[1])
    const endHour = Number.parseInt(endTime.split(":")[0])
    const endMinute = Number.parseInt(endTime.split(":")[1])

    const startSlot = (startHour - 7) * 2 + (startMinute >= 30 ? 1 : 0)
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 30

    return { startSlot, duration }
  }

  const totalStudents = lecturerClasses.reduce((sum, cls) => {
    const uniqueCourses = new Set()
    lecturerClasses.forEach((item) => uniqueCourses.add(item.courseCode))
    return Array.from(uniqueCourses).reduce((total, code) => {
      const course = lecturerClasses.find((item) => item.courseCode === code)
      return total + course.students
    }, 0)
  }, 0)

  const totalCourses = new Set(lecturerClasses.map((item) => item.courseCode)).size

  // Prepare data for PDF export
  const pdfData = {
    lecturerInfo,
    lecturerClasses,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          {lecturerInfo.semester}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {lecturerInfo.name}</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  {lecturerInfo.department}
                </div>
                <div>Employee ID: {lecturerInfo.employeeId}</div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-medium">Teaching: {totalCourses} Courses</span>
                  <span>Total Students: {totalStudents}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <PDFExportButton
                data={pdfData}
                type="lecturer-schedule"
                filename={`${lecturerInfo.name.replace(/\s+/g, "_")}_Teaching_Schedule.pdf`}
                variant="outline"
                size="sm"
              >
                Export Schedule
              </PDFExportButton>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Student Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              List View
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className={viewMode === "calendar" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Calendar View
            </Button>
          </div>

          {viewMode === "calendar" ? (
            // Calendar Grid View
            <Card className="shadow-sm border-gray-200 overflow-hidden">
              <CardHeader className="bg-gray-50 py-3">
                <CardTitle className="text-lg font-semibold text-gray-900">Weekly Teaching Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-6 border-b border-gray-200">
                      <div className="p-3 bg-gray-50 border-r border-gray-200 font-medium text-sm text-gray-600">
                        Time
                      </div>
                      {days.map((day) => (
                        <div
                          key={day}
                          className="p-3 bg-gray-50 border-r border-gray-200 text-center font-medium text-sm text-gray-900"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Time Slots Grid */}
                    <div className="relative">
                      {timeSlots.map((timeSlot, index) => (
                        <div key={timeSlot} className="grid grid-cols-6 border-b border-gray-100 min-h-[60px]">
                          {/* Time Column */}
                          <div className="p-2 bg-gray-50 border-r border-gray-200 text-xs text-gray-600 flex items-start">
                            {timeSlot.endsWith(":00") && formatTime(timeSlot)}
                          </div>

                          {/* Day Columns */}
                          {days.map((day) => {
                            const dayClasses = lecturerClasses.filter((item) => item.day === day)
                            return (
                              <div key={`${day}-${timeSlot}`} className="border-r border-gray-200 relative p-1">
                                {dayClasses.map((classItem) => {
                                  const { startSlot, duration } = getClassPosition(
                                    classItem.startTime,
                                    classItem.endTime,
                                  )
                                  if (startSlot === index) {
                                    return (
                                      <div
                                        key={classItem.id}
                                        className="absolute left-1 right-1 bg-green-100 border border-green-300 rounded p-2 text-xs z-10 shadow-sm"
                                        style={{
                                          height: `${duration * 60 - 4}px`,
                                          top: "2px",
                                        }}
                                      >
                                        <div className="font-semibold text-green-900 mb-1 leading-tight">
                                          {classItem.courseCode}
                                        </div>
                                        <div className="text-green-800 mb-1 leading-tight">
                                          {classItem.courseName.length > 25
                                            ? `${classItem.courseName.substring(0, 25)}...`
                                            : classItem.courseName}
                                        </div>
                                        <div className="text-green-600 leading-tight">
                                          {classItem.students} students
                                        </div>
                                        <div className="text-green-600 mt-1 leading-tight">
                                          {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // List View
            <div className="grid gap-4 md:gap-6">
              {days.map((day) => {
                const dayClasses = lecturerClasses.filter((item) => item.day === day)
                return (
                  <Card key={day} className="shadow-sm border-gray-200">
                    <CardHeader className="bg-gray-50 py-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        {day}
                        <Badge variant="secondary" className="ml-auto">
                          {dayClasses.length} {dayClasses.length === 1 ? "class" : "classes"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {dayClasses.length > 0 ? (
                        <div className="space-y-3">
                          {dayClasses
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((classItem) => (
                              <div
                                key={classItem.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-gray-900">{classItem.courseCode}</h3>
                                      <Badge className={getTypeColor(classItem.type)}>{classItem.type}</Badge>
                                    </div>
                                    <p className="text-gray-700 mb-1">{classItem.courseName}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {classItem.students} students
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        {classItem.program}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                    <Clock className="w-4 h-4" />
                                    {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No classes scheduled for {day}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-4">
            {Array.from(new Set(lecturerClasses.map((item) => item.courseCode))).map((courseCode) => {
              const course = lecturerClasses.find((item) => item.courseCode === courseCode)
              const courseSessions = lecturerClasses.filter((item) => item.courseCode === courseCode)
              return (
                <Card key={courseCode} className="shadow-sm border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{course.courseCode}</h3>
                        <p className="text-gray-600">{course.courseName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Materials
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Program:</span>
                        <p className="text-gray-600">{course.program}</p>
                      </div>
                      <div>
                        <span className="font-medium">Year:</span>
                        <p className="text-gray-600">{course.year}</p>
                      </div>
                      <div>
                        <span className="font-medium">Students:</span>
                        <p className="text-gray-600">{course.students}</p>
                      </div>
                      <div>
                        <span className="font-medium">Credits:</span>
                        <p className="text-gray-600">{course.credits}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="font-medium text-sm">Schedule:</span>
                      <div className="mt-2 space-y-1">
                        {courseSessions.map((session) => (
                          <div key={session.id} className="text-sm text-gray-600">
                            {session.day}: {formatTime(session.startTime)} - {formatTime(session.endTime)} (
                            {session.type})
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid gap-4">
            {Array.from(new Set(lecturerClasses.map((item) => item.courseCode))).map((courseCode) => {
              const course = lecturerClasses.find((item) => item.courseCode === courseCode)
              return (
                <Card key={courseCode} className="shadow-sm border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{course.courseCode}</h3>
                        <p className="text-gray-600">{course.courseName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export List
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Student
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">
                        Total Students: <span className="text-blue-600">{course.students}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        {course.program} - {course.year}
                      </span>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Student list will be displayed here</p>
                      <p className="text-sm">Click "Export List" to download the complete student roster</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
