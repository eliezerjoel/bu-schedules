"use client"

import { useState } from "react"
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

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "CSC 2101",
      name: "Data Structures and Algorithms",
      department: "Science & Technology",
      lecturer: "Dr. Sarah Nakato",
      students: 45,
      credits: 3,
      schedule: "Mon 8:00-10:00, Wed 14:00-17:00",
    },
    {
      id: 2,
      code: "BBA 3201",
      name: "Strategic Management",
      department: "Business",
      lecturer: "Prof. Mary Kisakye",
      students: 67,
      credits: 4,
      schedule: "Tue 10:00-12:00, Thu 14:00-16:00",
    },
    {
      id: 3,
      code: "EDU 2105",
      name: "Educational Psychology",
      department: "Education",
      lecturer: "Dr. Peter Musoke",
      students: 52,
      credits: 3,
      schedule: "Mon 14:00-16:00, Fri 10:00-12:00",
    },
  ])

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
    totalLecturers: 45,
    totalStudents: 2340,
    totalDepartments: 6,
    activeClasses: 89,
    conflicts: 3,
  }

  // Sample lecturers data
  const lecturers = [
    {
      id: 1,
      name: "Dr. Sarah Nakato",
      department: "Science & Technology",
      email: "s.nakato@bugema.ac.ug",
      courses: 3,
      students: 120,
      status: "Active",
    },
    {
      id: 2,
      name: "Prof. Mary Kisakye",
      department: "Business",
      email: "m.kisakye@bugema.ac.ug",
      courses: 2,
      students: 95,
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Peter Musoke",
      department: "Education",
      email: "p.musoke@bugema.ac.ug",
      courses: 4,
      students: 180,
      status: "Active",
    },
  ]

  // Sample departments data
  const departments = [
    {
      id: 1,
      name: "School of Business",
      shortName: "Business",
      head: "Prof. Mary Kisakye",
      email: "business@bugema.ac.ug",
      courses: 24,
      lecturers: 8,
      students: 450,
      programs: ["BBA", "BCOM", "MBA"],
      established: "1995",
      status: "Active",
    },
    {
      id: 2,
      name: "School of Science & Technology",
      shortName: "Science & Technology",
      head: "Dr. Sarah Nakato",
      email: "science@bugema.ac.ug",
      courses: 32,
      lecturers: 12,
      students: 380,
      programs: ["BSc Computer Science", "BSc IT", "BEng"],
      established: "1998",
      status: "Active",
    },
    {
      id: 3,
      name: "School of Education",
      shortName: "Education",
      head: "Dr. Peter Musoke",
      email: "education@bugema.ac.ug",
      courses: 28,
      lecturers: 10,
      students: 520,
      programs: ["BEd", "MEd", "Diploma in Education"],
      established: "1992",
      status: "Active",
    },
    {
      id: 4,
      name: "School of Theology",
      shortName: "Theology",
      head: "Rev. Dr. John Ssemakula",
      email: "theology@bugema.ac.ug",
      courses: 18,
      lecturers: 6,
      students: 180,
      programs: ["BTh", "MTh", "Diploma in Theology"],
      established: "1948",
      status: "Active",
    },
    {
      id: 5,
      name: "School of Health Sciences",
      shortName: "Health Sciences",
      head: "Dr. Grace Namukasa",
      email: "health@bugema.ac.ug",
      courses: 22,
      lecturers: 7,
      students: 290,
      programs: ["BSc Nursing", "BSc Public Health", "Diploma in Nursing"],
      established: "2005",
      status: "Active",
    },
    {
      id: 6,
      name: "School of Agriculture",
      shortName: "Agriculture",
      head: "Prof. James Okello",
      email: "agriculture@bugema.ac.ug",
      courses: 20,
      lecturers: 5,
      students: 220,
      programs: ["BSc Agriculture", "BSc Agribusiness", "Diploma in Agriculture"],
      established: "2000",
      status: "Active",
    },
  ]

  const handleSaveCourse = (courseData) => {
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
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
                              <div>Students: {lecturer.students}</div>
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
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
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
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Timetable
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

      {/* Course Creation Modal */}
      <CourseCreationModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        existingCourses={courses}
      />
    </div>
  )
}
