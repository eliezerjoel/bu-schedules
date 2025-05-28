"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  Grid3X3,
  List,
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  RefreshCw,
} from "lucide-react"

export function GeneralTimetable() {
  const [viewMode, setViewMode] = useState("calendar") // "calendar" or "list"
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all")

  // Sample comprehensive timetable data
  const allClasses = [
    // Business Department
    {
      id: 1,
      courseCode: "BBA 1101",
      courseName: "Introduction to Business",
      lecturer: "Prof. Mary Kisakye",
      department: "Business",
      program: "Bachelor of Business Administration",
      year: "Year 1",
      day: "Monday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      room: "Room 301, Main Block",
      students: 80,
      credits: 3,
    },
    {
      id: 2,
      courseCode: "BBA 3201",
      courseName: "Strategic Management",
      lecturer: "Prof. Mary Kisakye",
      department: "Business",
      program: "Bachelor of Business Administration",
      year: "Year 3",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      room: "Room 205, Business Block",
      students: 67,
      credits: 4,
    },
    {
      id: 3,
      courseCode: "BCOM 2101",
      courseName: "Financial Accounting",
      lecturer: "Dr. James Okello",
      department: "Business",
      program: "Bachelor of Commerce",
      year: "Year 2",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "16:00",
      type: "Lecture",
      room: "Room 102, Business Block",
      students: 55,
      credits: 3,
    },
    // Science & Technology Department
    {
      id: 4,
      courseCode: "CSC 1101",
      courseName: "Introduction to Programming",
      lecturer: "Dr. Sarah Nakato",
      department: "Science & Technology",
      program: "Bachelor of Computer Science",
      year: "Year 1",
      day: "Monday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      room: "Lab 1, ICT Block",
      students: 60,
      credits: 4,
    },
    {
      id: 5,
      courseCode: "CSC 2101",
      courseName: "Data Structures and Algorithms",
      lecturer: "Dr. Sarah Nakato",
      department: "Science & Technology",
      program: "Bachelor of Computer Science",
      year: "Year 2",
      day: "Monday",
      startTime: "14:00",
      endTime: "16:00",
      type: "Lecture",
      room: "Room 401, ICT Block",
      students: 45,
      credits: 3,
    },
    {
      id: 6,
      courseCode: "CSC 2102",
      courseName: "Object Oriented Programming",
      lecturer: "Mr. Peter Musoke",
      department: "Science & Technology",
      program: "Bachelor of Computer Science",
      year: "Year 2",
      day: "Tuesday",
      startTime: "08:00",
      endTime: "11:00",
      type: "Practical",
      room: "Lab 2, ICT Block",
      students: 45,
      credits: 4,
    },
    {
      id: 7,
      courseCode: "IT 2101",
      courseName: "Database Systems",
      lecturer: "Ms. Grace Namukasa",
      department: "Science & Technology",
      program: "Bachelor of Information Technology",
      year: "Year 2",
      day: "Wednesday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      room: "Room 302, ICT Block",
      students: 38,
      credits: 3,
    },
    // Education Department
    {
      id: 8,
      courseCode: "EDU 1101",
      courseName: "Foundations of Education",
      lecturer: "Dr. Peter Musoke",
      department: "Education",
      program: "Bachelor of Education",
      year: "Year 1",
      day: "Tuesday",
      startTime: "14:00",
      endTime: "16:00",
      type: "Lecture",
      room: "Room 201, Education Block",
      students: 70,
      credits: 3,
    },
    {
      id: 9,
      courseCode: "EDU 2105",
      courseName: "Educational Psychology",
      lecturer: "Dr. Peter Musoke",
      department: "Education",
      program: "Bachelor of Education",
      year: "Year 2",
      day: "Thursday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      room: "Room 203, Education Block",
      students: 52,
      credits: 3,
    },
    {
      id: 10,
      courseCode: "EDU 3201",
      courseName: "Curriculum Development",
      lecturer: "Ms. Grace Namukasa",
      department: "Education",
      program: "Bachelor of Education",
      year: "Year 3",
      day: "Friday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      room: "Room 205, Education Block",
      students: 40,
      credits: 4,
    },
    // Theology Department
    {
      id: 11,
      courseCode: "TH 1101",
      courseName: "Biblical Studies",
      lecturer: "Rev. Dr. John Ssemakula",
      department: "Theology",
      program: "Bachelor of Theology",
      year: "Year 1",
      day: "Wednesday",
      startTime: "08:00",
      endTime: "10:00",
      type: "Lecture",
      room: "Room 101, Theology Block",
      students: 35,
      credits: 3,
    },
    {
      id: 12,
      courseCode: "TH 2201",
      courseName: "Systematic Theology",
      lecturer: "Rev. Dr. John Ssemakula",
      department: "Theology",
      program: "Bachelor of Theology",
      year: "Year 2",
      day: "Thursday",
      startTime: "14:00",
      endTime: "17:00",
      type: "Lecture",
      room: "Room 102, Theology Block",
      students: 28,
      credits: 4,
    },
    // Health Sciences Department
    {
      id: 13,
      courseCode: "NSG 1101",
      courseName: "Fundamentals of Nursing",
      lecturer: "Dr. Grace Namukasa",
      department: "Health Sciences",
      program: "Bachelor of Nursing",
      year: "Year 1",
      day: "Monday",
      startTime: "08:00",
      endTime: "11:00",
      type: "Practical",
      room: "Nursing Lab, Health Block",
      students: 42,
      credits: 4,
    },
    {
      id: 14,
      courseCode: "PH 2101",
      courseName: "Public Health Principles",
      lecturer: "Dr. Grace Namukasa",
      department: "Health Sciences",
      program: "Bachelor of Public Health",
      year: "Year 2",
      day: "Friday",
      startTime: "14:00",
      endTime: "16:00",
      type: "Lecture",
      room: "Room 301, Health Block",
      students: 35,
      credits: 3,
    },
    // Agriculture Department
    {
      id: 15,
      courseCode: "AGR 1101",
      courseName: "Introduction to Agriculture",
      lecturer: "Prof. James Okello",
      department: "Agriculture",
      program: "Bachelor of Agriculture",
      year: "Year 1",
      day: "Thursday",
      startTime: "10:00",
      endTime: "12:00",
      type: "Lecture",
      room: "Room 201, Agriculture Block",
      students: 48,
      credits: 3,
    },
    {
      id: 16,
      courseCode: "AGR 2201",
      courseName: "Crop Production",
      lecturer: "Prof. James Okello",
      department: "Agriculture",
      program: "Bachelor of Agriculture",
      year: "Year 2",
      day: "Friday",
      startTime: "08:00",
      endTime: "11:00",
      type: "Practical",
      room: "Agriculture Farm",
      students: 40,
      credits: 4,
    },
  ]

  const departments = ["Business", "Science & Technology", "Education", "Theology", "Health Sciences", "Agriculture"]

  const programs = [
    "Bachelor of Business Administration",
    "Bachelor of Commerce",
    "Bachelor of Computer Science",
    "Bachelor of Information Technology",
    "Bachelor of Education",
    "Bachelor of Theology",
    "Bachelor of Nursing",
    "Bachelor of Public Health",
    "Bachelor of Agriculture",
  ]

  const years = ["Year 1", "Year 2", "Year 3", "Year 4"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  // Filter classes based on selected filters
  const filteredClasses = allClasses.filter((classItem) => {
    const matchesSearch =
      searchTerm === "" ||
      classItem.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.lecturer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || classItem.department === selectedDepartment
    const matchesProgram = selectedProgram === "all" || classItem.program === selectedProgram
    const matchesYear = selectedYear === "all" || classItem.year === selectedYear
    const matchesDay = selectedDay === "all" || classItem.day === selectedDay

    return matchesSearch && matchesDepartment && matchesProgram && matchesYear && matchesDay
  })

  const getDepartmentColor = (department) => {
    const colors = {
      Business: "bg-blue-100 text-blue-800 border-blue-300",
      "Science & Technology": "bg-green-100 text-green-800 border-green-300",
      Education: "bg-purple-100 text-purple-800 border-purple-300",
      Theology: "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Health Sciences": "bg-red-100 text-red-800 border-red-300",
      Agriculture: "bg-orange-100 text-orange-800 border-orange-300",
    }
    return colors[department] || "bg-gray-100 text-gray-800 border-gray-300"
  }

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

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartment("all")
    setSelectedProgram("all")
    setSelectedYear("all")
    setSelectedDay("all")
  }

  const totalClasses = filteredClasses.length
  const totalStudents = filteredClasses.reduce((sum, cls) => sum + cls.students, 0)
  const uniqueLecturers = new Set(filteredClasses.map((cls) => cls.lecturer)).size
  const uniqueDepartments = new Set(filteredClasses.map((cls) => cls.department)).size

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">General University Timetable</h1>
        <p className="text-gray-600">Complete schedule for all courses and programs at Bugema University</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Semester 1, 2024/2025</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-bold text-gray-900">{totalClasses}</div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-gray-900">{totalStudents}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-xl font-bold text-gray-900">{uniqueLecturers}</div>
            <div className="text-sm text-gray-600">Lecturers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-xl font-bold text-gray-900">{uniqueDepartments}</div>
            <div className="text-sm text-gray-600">Departments</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={viewMode === "calendar" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses, lecturers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Program Filter */}
            <div>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program.length > 20 ? `${program.substring(0, 20)}...` : program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Day Filter for List View */}
          {viewMode === "list" && (
            <div className="flex flex-wrap gap-2 mt-4">
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
        </CardContent>
      </Card>

      {/* Timetable Views */}
      {viewMode === "calendar" ? (
        // Calendar Grid View
        <Card className="shadow-sm border-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50 py-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Weekly Calendar View</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
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
                        const dayClasses = filteredClasses.filter((item) => item.day === day)
                        return (
                          <div key={`${day}-${timeSlot}`} className="border-r border-gray-200 relative p-1">
                            {dayClasses.map((classItem) => {
                              const { startSlot, duration } = getClassPosition(classItem.startTime, classItem.endTime)
                              if (startSlot === index) {
                                return (
                                  <div
                                    key={classItem.id}
                                    className={`absolute left-1 right-1 border rounded p-2 text-xs z-10 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getDepartmentColor(classItem.department)}`}
                                    style={{
                                      height: `${duration * 60 - 4}px`,
                                      top: "2px",
                                    }}
                                    title={`${classItem.courseCode}: ${classItem.courseName}\nLecturer: ${classItem.lecturer}\nRoom: ${classItem.room}\nStudents: ${classItem.students}`}
                                  >
                                    <div className="font-semibold mb-1 leading-tight">{classItem.courseCode}</div>
                                    <div className="mb-1 leading-tight">
                                      {classItem.courseName.length > 20
                                        ? `${classItem.courseName.substring(0, 20)}...`
                                        : classItem.courseName}
                                    </div>
                                    <div className="leading-tight">{classItem.lecturer.split(" ")[0]}</div>
                                    <div className="leading-tight">{classItem.room.split(",")[0]}</div>
                                    <div className="mt-1 leading-tight">
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
          {selectedDay === "all" ? (
            // Weekly view
            days.map((day) => {
              const dayClasses = filteredClasses.filter((item) => item.day === day)
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
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="font-semibold text-gray-900">{classItem.courseCode}</h3>
                                    <Badge className={getDepartmentColor(classItem.department)}>
                                      {classItem.department}
                                    </Badge>
                                    <Badge className={getTypeColor(classItem.type)}>{classItem.type}</Badge>
                                  </div>
                                  <p className="text-gray-700 mb-2">{classItem.courseName}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <GraduationCap className="w-4 h-4" />
                                      {classItem.lecturer}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Building2 className="w-4 h-4" />
                                      {classItem.room}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {classItem.students} students
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-4 h-4" />
                                      {classItem.program}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {classItem.year}
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
            // Single day view
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-blue-50 py-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  {selectedDay}
                  <Badge variant="secondary" className="ml-auto">
                    {filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {filteredClasses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredClasses
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((classItem) => (
                        <div
                          key={classItem.id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <h3 className="text-lg font-semibold text-gray-900">{classItem.courseCode}</h3>
                                <Badge className={getDepartmentColor(classItem.department)}>
                                  {classItem.department}
                                </Badge>
                                <Badge className={getTypeColor(classItem.type)}>{classItem.type}</Badge>
                                <Badge variant="outline">{classItem.credits} Credits</Badge>
                              </div>
                              <p className="text-gray-700 text-lg mb-3">{classItem.courseName}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" />
                                  <span>{classItem.lecturer}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4" />
                                  <span>{classItem.room}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>{classItem.students} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{classItem.program}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{classItem.year}</span>
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
                    <p className="text-lg">No classes found matching your filters</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Department Legend */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Department Color Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border ${getDepartmentColor(dept)}`}></div>
                <span className="text-sm text-gray-700">{dept}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
