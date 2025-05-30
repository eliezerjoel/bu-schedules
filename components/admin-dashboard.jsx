'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Users,
  BookOpen,
  Building2,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  BarChart3,
  Clock,
  GraduationCap,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { CourseCreationModal } from "./course-creation-modal"
import { LecturerCreationModal } from "./lecturer-creation-modal"
import { DepartmentCreationModal } from "./department-creation-modal"

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false)
  const [courses, setCourses] = useState([])
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [departments, setDepartments] = useState([])

  // New state variables for timetable generation feedback
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(null)
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const handleGenerateTimetable = async () => {
    setIsGenerating(true) // Set generating to true
    setGenerateError(null) // Clear previous errors
    setGenerateSuccess(false); // Clear previous success

    try {
      const response = await fetch("http://localhost:8080/api/schedule/generate", {
        method: "POST", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json",
          // Add any other headers like Authorization if needed
        },
        // If your POST request needs a body (e.g., configuration for generation),
        // uncomment and adjust the 'body' property:
        // body: JSON.stringify({ /* your data here */ }),
      })

      if (!response.ok) {
        // If the server response was not ok (e.g., 4xx or 5xx status)
        const errorData = await response.json().catch(() => ({ message: "Unknown error" })); // Try to parse error message
        throw new Error(`Failed to generate timetable: ${response.status} ${response.statusText} - ${errorData.message || ''}`)
      }

      // Assuming a successful response means the generation process started/completed
      // If the API returns useful data, you can consume it:
      const result = await response.json();
      console.log("Timetable generation initiated/completed:", result);
      setGenerateSuccess(true); // Set success state

      // Optionally, if the GeneralTimetable component needs to refresh its data
      // after generation, you might need a way to trigger that (e.g., a prop, or global state).
      // For now, we'll just show a success message.

    } catch (error) {
      console.error("Error generating timetable:", error)
      setGenerateError(error.message)
    } finally {
      setIsGenerating(false) // Set generating to false regardless of success or failure
      console.log("Timetable generation process completed") // Changed from console.error to console.log
    }
  }

  // Fetch departments from API on mount or after creation
  const fetchDepartments = () => {
    fetch("http://localhost:8080/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => {
        console.error("Failed to fetch departments:", err)
      })
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleDepartmentCreated = () => {
    fetchDepartments()
  }
  // Fetch courses from API on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => {
        // Map API fields to UI fields
        const mappedCourses = data.map((course, idx) => ({
          id: course.id || idx + 1,
          code: course.courseCode,
          name: course.courseName,
          department: course.departmentId || "Unassigned",
          lecturer: "Unassigned", // This might need actual lecturer data from backend
          students: 0, // This might need actual student count from backend
          credits: 0, // This might need actual credits from backend
          schedule: "Unassigned", // This might need actual schedule data from backend
        }))
        setCourses(mappedCourses)
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err)
      })
  }, [])

  // Sample admin data
  const adminInfo = {
    name: "Dr. John Mukasa",
    role: "System Administrator",
    lastLogin: "2024-01-15 09:30 AM",
    semester: "Semester 1, 2024/2025",
  }

  // Sample statistics
  const stats = {
    totalCourses: courses.length,
    totalLecturers: 45, // Placeholder, fetch from API if available
    totalStudents: 2340, // Placeholder, fetch from API if available
    totalDepartments: departments.length,
    activeClasses: 89, // Placeholder, fetch from API if available
    conflicts: 3, // Placeholder, fetch from API if available
  }
  // Lecturers state
  const [lecturers, setLecturers] = useState([])

  // Fetch lecturers from API on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/instructors")
      .then((res) => res.json())
      .then((data) => {
        const mappedLecturers = data.map((lecturer, idx) => ({
          id: lecturer.id || idx + 1,
          name: `${lecturer.firstName} ${lecturer.lastName}`,
          department: lecturer.department,
          email: lecturer.email,
          courses: "Counting", // Placeholder, populate with actual course count/list
          status: "Active",
        }))
        setLecturers(mappedLecturers)
      })
      .catch((err) => {
        console.error("Failed to fetch lecturers:", err)
      })
  }, [])
  // Handle lecturer creation
  const handleLecturerCreated = () => {
    fetch("http://localhost:8080/api/instructors")
      .then((res) => res.json())
      .then((data) => {
        const mappedLecturers = data.map((lecturer, idx) => ({
          id: lecturer.id || idx + 1,
          name: `${lecturer.firstName} ${lecturer.lastName}`,
          department: lecturer.department,
          email: lecturer.email,
          courses: "Counting", // This needs to be calculated or fetched
          status: "Active",
        }))
        setLecturers(mappedLecturers)
      })
      .catch((err) => {
        console.error("Failed to fetch lecturers:", err)
      })
  }

  const handleSaveCourse = (courseData) => {
    // This part should ideally send a POST request to your backend to create the course
    // For now, it's updating local state directly as per previous logic.
    const newCourse = {
      id: Date.now(), // In real app, this would be generated by backend
      code: courseData.courseCode,
      name: courseData.courseName,
      department: courseData.department,
      lecturer: courseData.lecturer,
      students: Number.parseInt(courseData.students),
      credits: Number.parseInt(courseData.credits),
      schedule: `${courseData.day} ${courseData.startTime}-${courseData.endTime}`,
    }

    setCourses([...courses, newCourse])
    console.log("New course saved:", newCourse)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          {adminInfo.semester}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Admin Dashboard
              </h1>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Welcome, {adminInfo.name}</div>
                <div>{adminInfo.role}</div>
                <div>Last login: {adminInfo.lastLogin}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalLecturers}</div>
              <div className="text-sm text-gray-600">Lecturers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</div>
              <div className="text-sm text-gray-600">Departments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.activeClasses}</div>
              <div className="text-sm text-gray-600">Active Classes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.conflicts}</div>
              <div className="text-sm text-gray-600">Conflicts</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {generateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Timetable generation request sent.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setGenerateSuccess(false)}>
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 3.15a1.2 1.2 0 1 1-1.697-1.697l3.15-2.651-3.15-2.651a1.2 1.2 0 1 1 1.697-1.697l2.651 3.15 2.651-3.15a1.2 1.2 0 1 1 1.697 1.697l-3.15 2.651 3.15 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
            </span>
          </div>
        )}

        {generateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {generateError}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setGenerateError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 3.15a1.2 1.2 0 1 1-1.697-1.697l3.15-2.651-3.15-2.651a1.2 1.2 0 1 1 1.697-1.697l2.651 3.15 2.651-3.15a1.2 1.2 0 1 1 1.697 1.697l-3.15 2.651 3.15 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
            </span>
          </div>
        )}

        <TabsContent value="courses" className="space-y-6">
          {/* Course Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Management
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsCourseModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="science">Science & Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Courses Table */}
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{course.code}</h3>
                            <Badge variant="outline">{course.credits} Credits</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{course.name}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div>Department: {course.department}</div>
                            <div>Lecturer: {course.lecturer}</div>
                            <div>Students: {course.students}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Schedule: {course.schedule}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lecturers" className="space-y-6">
          {/* Lecturer Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Lecturer Management
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setIsLecturerModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lecturer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturers.map((lecturer) => (
                  <Link key={lecturer.id} href={`/admin/lecturers/${lecturer.id}`}>
                    <Card className="border border-gray-200 hover:shadow-lg hover:border-red-300 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
                                {lecturer.name}
                              </h3>
                              <Badge variant={lecturer.status === "Active" ? "default" : "secondary"}>
                                {lecturer.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div>Department: {lecturer.department}</div>
                              <div>Email: {lecturer.email}</div>
                              <div>Courses: {lecturer.courses}</div>
                              {/* <div>Students: {lecturer.students}</div> If applicable */}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Handle edit action
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Handle delete action
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {/* Department Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Department Management
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setIsDepartmentModalOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Department Reports
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((department) => (
                  <Card key={department.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{department.name}</h3>
                            <Badge variant={department.status === "Active" ? "default" : "secondary"}>
                              {department.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                            <div>Head: {department.head}</div>
                            <div>Courses: {department.courses}</div>
                            <div>Lecturers: {department.lecturers}</div>
                            <div>Students: {department.students}</div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Email: {department.email} | Established: {department.established}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {department.programs.map((program, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {program}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable" className="space-y-6">
          {/* Timetable Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timetable Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Timetable Management</h3>
                <p className="mb-4">Manage university-wide timetables, resolve conflicts, and optimize schedules</p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleGenerateTimetable}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isGenerating} // Disable button while generating
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Timetable
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Resolve Conflicts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Academic Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="semester">Current Semester</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sem1-2024">Semester 1, 2024/2025</SelectItem>
                          <SelectItem value="sem2-2024">Semester 2, 2024/2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="academic-year">Academic Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-2025">2024/2025</SelectItem>
                          <SelectItem value="2025-2026">2025/2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">System Maintenance</h3>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Backup Data
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore Data
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      <Settings className="w-4 h-4 mr-2" />
                      System Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CourseCreationModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        existingCourses={courses}
      />

      {/* Department Creation Modal */}
      <DepartmentCreationModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        onCreated={handleDepartmentCreated}
      />

      {/* Lecturer Creation Modal */}
      <LecturerCreationModal
        isOpen={isLecturerModalOpen}
        onClose={() => setIsLecturerModalOpen(false)}
        onCreated={handleLecturerCreated}
      />
      {/* This DepartmentCreationModal appears to be a duplicate, consider removing if not intentional */}
      <DepartmentCreationModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        onCreated={handleDepartmentCreated}
      />
    </div>
  )
}