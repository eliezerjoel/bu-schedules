"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, BookOpen, Plus, Trash2 } from "lucide-react"
import { ScheduleModal } from "./schedule-modal"
import Link from "next/link"

export function AdminLecturerSchedule({ lecturerId }) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("create") // "create", "edit", "delete"

  // Sample lecturer data - in real app this would come from API based on lecturerId
  const lecturer = {
    id: lecturerId,
    name: "Dr. Sarah Nakato",
    department: "School of Science & Technology",
    email: "s.nakato@bugema.ac.ug",
    employeeId: "BU2019001",
    status: "Active",
    courses: 3,
    students: 120,
  }

  // Sample schedule data - in real app this would come from API
  const [schedules, setSchedules] = useState([
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
  ])

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

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

  const isTimeSlotOccupied = (day, timeSlotIndex) => {
    return schedules.some((schedule) => {
      if (schedule.day !== day) return false
      const { startSlot, duration } = getClassPosition(schedule.startTime, schedule.endTime)
      return timeSlotIndex >= startSlot && timeSlotIndex < startSlot + duration
    })
  }

  const getScheduleAtTimeSlot = (day, timeSlotIndex) => {
    return schedules.find((schedule) => {
      if (schedule.day !== day) return false
      const { startSlot, duration } = getClassPosition(schedule.startTime, schedule.endTime)
      return timeSlotIndex >= startSlot && timeSlotIndex < startSlot + duration
    })
  }

  const handleTimeSlotClick = (day, timeSlotIndex, timeSlot) => {
    const existingSchedule = getScheduleAtTimeSlot(day, timeSlotIndex)

    if (existingSchedule) {
      // Edit existing schedule
      setSelectedSchedule(existingSchedule)
      setModalMode("edit")
      setIsModalOpen(true)
    } else {
      // Create new schedule
      setSelectedTimeSlot({ day, timeSlot, timeSlotIndex })
      setSelectedSchedule(null)
      setModalMode("create")
      setIsModalOpen(true)
    }
  }

  const handleDeleteSchedule = (schedule) => {
    setSelectedSchedule(schedule)
    setModalMode("delete")
    setIsModalOpen(true)
  }

  const handleSaveSchedule = (scheduleData) => {
    if (modalMode === "create") {
      const newSchedule = {
        id: Date.now(), // In real app, this would be generated by backend
        ...scheduleData,
      }
      setSchedules([...schedules, newSchedule])
    } else if (modalMode === "edit") {
      setSchedules(schedules.map((s) => (s.id === selectedSchedule.id ? { ...s, ...scheduleData } : s)))
    } else if (modalMode === "delete") {
      setSchedules(schedules.filter((s) => s.id !== selectedSchedule.id))
    }

    setIsModalOpen(false)
    setSelectedTimeSlot(null)
    setSelectedSchedule(null)
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Lecture":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Practical":
        return "bg-green-100 text-green-800 border-green-300"
      case "Tutorial":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            Semester 1, 2024/2025
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Schedule: {lecturer.name}</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  {lecturer.department}
                </div>
                <div>Employee ID: {lecturer.employeeId}</div>
                <div>Email: {lecturer.email}</div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-medium">Teaching: {lecturer.courses} Courses</span>
                  <span>Total Students: {lecturer.students}</span>
                  <Badge variant={lecturer.status === "Active" ? "default" : "secondary"}>{lecturer.status}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedTimeSlot(null)
                  setSelectedSchedule(null)
                  setModalMode("create")
                  setIsModalOpen(true)
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Schedule Management Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Click on empty time slots</strong> to create new schedules
            </li>
            <li>
              • <strong>Click on existing schedules</strong> to edit or view details
            </li>
            <li>
              • <strong>Use the delete button</strong> in the edit modal to remove schedules
            </li>
            <li>
              • <strong>Drag and drop</strong> functionality coming soon
            </li>
          </ul>
        </div>
      </div>

      {/* Schedule Grid */}
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardHeader className="bg-gray-50 py-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Weekly Teaching Schedule - Click to Edit
          </CardTitle>
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
                      const isOccupied = isTimeSlotOccupied(day, index)
                      const schedule = getScheduleAtTimeSlot(day, index)

                      return (
                        <div key={`${day}-${timeSlot}`} className="border-r border-gray-200 relative p-1">
                          {schedule && getClassPosition(schedule.startTime, schedule.endTime).startSlot === index ? (
                            // Existing Schedule Block
                            <div
                              className={`absolute left-1 right-1 border rounded p-2 text-xs z-10 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${getTypeColor(schedule.type)}`}
                              style={{
                                height: `${getClassPosition(schedule.startTime, schedule.endTime).duration * 60 - 4}px`,
                                top: "2px",
                              }}
                              onClick={() => handleTimeSlotClick(day, index, timeSlot)}
                            >
                              <div className="font-semibold mb-1 leading-tight">{schedule.courseCode}</div>
                              <div className="mb-1 leading-tight">
                                {schedule.courseName.length > 25
                                  ? `${schedule.courseName.substring(0, 25)}...`
                                  : schedule.courseName}
                              </div>
                              <div className="leading-tight">{schedule.students} students</div>
                              <div className="mt-1 leading-tight">
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                              </div>
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-red-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteSchedule(schedule)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : !isOccupied ? (
                            // Empty Time Slot
                            <div
                              className="absolute inset-1 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors flex items-center justify-center group"
                              onClick={() => handleTimeSlotClick(day, index, timeSlot)}
                            >
                              <Plus className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                            </div>
                          ) : null}
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

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        mode={modalMode}
        schedule={selectedSchedule}
        timeSlot={selectedTimeSlot}
        lecturer={lecturer}
      />

      {/* Summary */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Teaching Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(schedules.map((item) => item.courseCode)).size}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {schedules.reduce((sum, schedule) => {
                const uniqueCourses = new Set()
                schedules.forEach((item) => uniqueCourses.add(item.courseCode))
                return Array.from(uniqueCourses).reduce((total, code) => {
                  const course = schedules.find((item) => item.courseCode === code)
                  return total + course.students
                }, 0)
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{schedules.length}</div>
            <div className="text-sm text-gray-600">Weekly Classes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {schedules.reduce((sum, schedule) => {
                const uniqueCourses = new Set()
                schedules.forEach((item) => uniqueCourses.add(item.courseCode))
                return Array.from(uniqueCourses).reduce((total, code) => {
                  const course = schedules.find((item) => item.courseCode === code)
                  return total + course.credits
                }, 0)
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
        </div>
      </div>
    </div>
  )
}
