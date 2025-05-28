"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, ArrowLeft, RefreshCw } from "lucide-react"
import { PDFExportButton } from "./pdf-export"

export function StudentTimetable() {
  const [selectedDay, setSelectedDay] = useState("all")
  const [viewMode, setViewMode] = useState("list") // "list" or "calendar"

  // Sample student data - in real app this would come from URL params or API
  const studentInfo = {
    department: "School of Science & Technology",
    program: "Bachelor of Computer Science",
    year: "Year 2",
    semester: "Semester 1, 2024/2025",
  }

  // Sample timetable data - in real app this would come from API
  const timetableData = [
    {
      id: 1,
      courseCode: "CSC 2101",
      courseName: "Data Structures and Algorithms",
      lecturer: "Dr. Sarah Nakato",
      day: "Monday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      credits: 3,
    },
    {
      id: 2,
      courseCode: "CSC 2102",
      courseName: "Object Oriented Programming",
      lecturer: "Mr. James Okello",
      day: "Monday",
      startTime: "10:30",
      endTime: "12:30",
      type: "Practical",
      credits: 4,
    },
    {
      id: 3,
      courseCode: "MTH 2201",
      courseName: "Discrete Mathematics",
      lecturer: "Prof. Mary Kisakye",
      day: "Tuesday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      credits: 3,
    },
    {
      id: 4,
      courseCode: "CSC 2103",
      courseName: "Database Systems",
      lecturer: "Dr. Peter Musoke",
      day: "Tuesday",
      startTime: "14:00",
      endTime: "16:00",
      type: "Lecture",
      credits: 3,
    },
    {
      id: 5,
      courseCode: "CSC 2104",
      courseName: "Computer Networks",
      lecturer: "Ms. Grace Namukasa",
      day: "Wednesday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      credits: 3,
    },
    {
      id: 6,
      courseCode: "CSC 2102",
      courseName: "Object Oriented Programming",
      lecturer: "Mr. James Okello",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "17:00",
      type: "Practical",
      credits: 4,
    },
    {
      id: 7,
      courseCode: "GEN 2001",
      courseName: "Communication Skills",
      lecturer: "Dr. Ruth Namusoke",
      day: "Thursday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      credits: 2,
    },
    {
      id: 8,
      courseCode: "CSC 2103",
      courseName: "Database Systems",
      lecturer: "Dr. Peter Musoke",
      day: "Thursday",
      startTime: "14:00",
      endTime: "17:00",
      type: "Practical",
      credits: 3,
    },
    {
      id: 9,
      courseCode: "MTH 2201",
      courseName: "Discrete Mathematics",
      lecturer: "Prof. Mary Kisakye",
      day: "Friday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Tutorial",
      credits: 3,
    },
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const filteredTimetable =
    selectedDay === "all" ? timetableData : timetableData.filter((item) => item.day === selectedDay)

  const totalCredits = timetableData.reduce((sum, course) => {
    const uniqueCourses = new Set()
    timetableData.forEach((item) => uniqueCourses.add(item.courseCode))
    return Array.from(uniqueCourses).reduce((total, code) => {
      const course = timetableData.find((item) => item.courseCode === code)
      return total + course.credits
    }, 0)
  }, 0)

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

  // Prepare data for PDF export
  const pdfData = {
    studentInfo,
    timetableData,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {studentInfo.semester}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Timetable</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  {studentInfo.program} - {studentInfo.year}
                </div>
                <div>{studentInfo.department}</div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-medium">Total Credits: {totalCredits}</span>
                  <span>Total Courses: {new Set(timetableData.map((item) => item.courseCode)).size}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <PDFExportButton
                data={pdfData}
                type="student-timetable"
                filename={`${studentInfo.program.replace(/\s+/g, "_")}_${studentInfo.year.replace(/\s+/g, "_")}_Timetable.pdf`}
                variant="outline"
                size="sm"
              />
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* View Toggle and Day Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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

          {viewMode === "list" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDay === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay("all")}
                className={selectedDay === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                All Days
              </Button>
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                  className={selectedDay === day ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {day}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timetable Views */}
      {viewMode === "calendar" ? (
        // Calendar Grid View
        <Card className="shadow-sm border-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50 py-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Weekly Calendar View</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-6 border-b border-gray-200">
                  <div className="p-3 bg-gray-50 border-r border-gray-200 font-medium text-sm text-gray-600">Time</div>
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
                        const dayClasses = timetableData.filter((item) => item.day === day)
                        return (
                          <div key={`${day}-${timeSlot}`} className="border-r border-gray-200 relative p-1">
                            {dayClasses.map((classItem) => {
                              const { startSlot, duration } = getClassPosition(classItem.startTime, classItem.endTime)
                              if (startSlot === index) {
                                return (
                                  <div
                                    key={classItem.id}
                                    className="absolute left-1 right-1 bg-blue-100 border border-blue-300 rounded p-2 text-xs z-10 shadow-sm"
                                    style={{
                                      height: `${duration * 60 - 4}px`,
                                      top: "2px",
                                    }}
                                  >
                                    <div className="font-semibold text-blue-900 mb-1 leading-tight">
                                      {classItem.courseCode}
                                    </div>
                                    <div className="text-blue-800 mb-1 leading-tight">
                                      {classItem.courseName.length > 25
                                        ? `${classItem.courseName.substring(0, 25)}...`
                                        : classItem.courseName}
                                    </div>
                                    <div className="text-blue-600 mt-1 leading-tight">
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
        // Original List View
        <div className="grid gap-4 md:gap-6">
          {selectedDay === "all" ? (
            // Weekly view
            days.map((day) => {
              const dayClasses = timetableData.filter((item) => item.day === day)
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
                                      <User className="w-4 h-4" />
                                      {classItem.lecturer}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-4 h-4" />
                                      {classItem.type}
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
            })
          ) : (
            // Single day view (existing code remains the same)
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-blue-50 py-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  {selectedDay}
                  <Badge variant="secondary" className="ml-auto">
                    {filteredTimetable.length} {filteredTimetable.length === 1 ? "class" : "classes"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {filteredTimetable.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTimetable
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((classItem) => (
                        <div
                          key={classItem.id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{classItem.courseCode}</h3>
                                <Badge className={getTypeColor(classItem.type)}>{classItem.type}</Badge>
                                <Badge variant="outline">{classItem.credits} Credits</Badge>
                              </div>
                              <p className="text-gray-700 text-lg mb-3">{classItem.courseName}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>{classItem.lecturer}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{classItem.type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                              <Clock className="w-5 h-5" />
                              {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No classes scheduled for {selectedDay}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Semester Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(timetableData.map((item) => item.courseCode)).size}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{totalCredits}</div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{timetableData.length}</div>
            <div className="text-sm text-gray-600">Weekly Classes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {new Set(timetableData.map((item) => item.lecturer)).size}
            </div>
            <div className="text-sm text-gray-600">Lecturers</div>
          </div>
        </div>
      </div>
    </div>
  )
}
