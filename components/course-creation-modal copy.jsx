"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Save,
  X,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Building2,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
} from "lucide-react"

export function CourseCreationModal({ isOpen, onClose, onSave, existingCourses = [] }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    department: "",
    courseCode: "",
    courseName: "",
    credits: "",
    program: "",
    year: "",
    lecturer: "",
    day: "",
    startTime: "",
    endTime: "",
    type: "",
    students: "",
  })
  const [errors, setErrors] = useState({})
  const [isCheckingConflict, setIsCheckingConflict] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictDetails, setConflictDetails] = useState(null)

  // Sample data - in real app this would come from API
  const departments = [
    { id: "business", name: "School of Business", shortName: "Business" },
    { id: "science", name: "School of Science & Technology", shortName: "Science & Technology" },
    { id: "education", name: "School of Education", shortName: "Education" },
    { id: "theology", name: "School of Theology", shortName: "Theology" },
    { id: "health", name: "School of Health Sciences", shortName: "Health Sciences" },
    { id: "agriculture", name: "School of Agriculture", shortName: "Agriculture" },
  ]

  const coursesByDepartment = {
    business: [
      { code: "BBA 1101", name: "Introduction to Business", credits: 3 },
      { code: "BBA 2201", name: "Marketing Principles", credits: 4 },
      { code: "BBA 3201", name: "Strategic Management", credits: 4 },
      { code: "BCOM 2101", name: "Financial Accounting", credits: 3 },
    ],
    science: [
      { code: "CSC 1101", name: "Introduction to Programming", credits: 4 },
      { code: "CSC 2101", name: "Data Structures and Algorithms", credits: 3 },
      { code: "CSC 2102", name: "Object Oriented Programming", credits: 4 },
      { code: "CSC 3201", name: "Advanced Algorithms", credits: 4 },
      { code: "IT 2101", name: "Database Systems", credits: 3 },
    ],
    education: [
      { code: "EDU 1101", name: "Foundations of Education", credits: 3 },
      { code: "EDU 2105", name: "Educational Psychology", credits: 3 },
      { code: "EDU 3201", name: "Curriculum Development", credits: 4 },
    ],
    theology: [
      { code: "TH 1101", name: "Biblical Studies", credits: 3 },
      { code: "TH 2201", name: "Systematic Theology", credits: 4 },
    ],
    health: [
      { code: "NSG 1101", name: "Fundamentals of Nursing", credits: 4 },
      { code: "PH 2101", name: "Public Health Principles", credits: 3 },
    ],
    agriculture: [
      { code: "AGR 1101", name: "Introduction to Agriculture", credits: 3 },
      { code: "AGR 2201", name: "Crop Production", credits: 4 },
    ],
  }

  const programsByDepartment = {
    business: ["Bachelor of Business Administration", "Bachelor of Commerce", "Master of Business Administration"],
    science: ["Bachelor of Computer Science", "Bachelor of Information Technology", "Bachelor of Engineering"],
    education: ["Bachelor of Education", "Master of Education", "Diploma in Education"],
    theology: ["Bachelor of Theology", "Master of Theology", "Diploma in Theology"],
    health: ["Bachelor of Nursing", "Bachelor of Public Health", "Diploma in Nursing"],
    agriculture: ["Bachelor of Agriculture", "Bachelor of Agribusiness", "Diploma in Agriculture"],
  }

  const lecturersByDepartment = {
    business: [
      { id: 1, name: "Prof. Mary Kisakye", email: "m.kisakye@bugema.ac.ug" },
      { id: 2, name: "Dr. James Okello", email: "j.okello@bugema.ac.ug" },
    ],
    science: [
      { id: 3, name: "Dr. Sarah Nakato", email: "s.nakato@bugema.ac.ug" },
      { id: 4, name: "Mr. Peter Musoke", email: "p.musoke@bugema.ac.ug" },
    ],
    education: [
      { id: 5, name: "Dr. Peter Musoke", email: "p.musoke@bugema.ac.ug" },
      { id: 6, name: "Ms. Grace Namukasa", email: "g.namukasa@bugema.ac.ug" },
    ],
    theology: [{ id: 7, name: "Rev. Dr. John Ssemakula", email: "j.ssemakula@bugema.ac.ug" }],
    health: [{ id: 8, name: "Dr. Grace Namukasa", email: "g.namukasa@bugema.ac.ug" }],
    agriculture: [{ id: 9, name: "Prof. James Okello", email: "j.okello@bugema.ac.ug" }],
  }

  const years = ["Year 1", "Year 2", "Year 3", "Year 4"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const types = ["Lecture", "Practical", "Tutorial"]

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 7; hour <= 18; hour++) {
      options.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour < 18) {
        options.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const steps = [
    { number: 1, title: "Department", icon: Building2 },
    { number: 2, title: "Course", icon: BookOpen },
    { number: 3, title: "Lecturer", icon: GraduationCap },
    { number: 4, title: "Schedule", icon: Calendar },
  ]

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setFormData({
        department: "",
        courseCode: "",
        courseName: "",
        credits: "",
        program: "",
        year: "",
        lecturer: "",
        day: "",
        startTime: "",
        endTime: "",
        type: "",
        students: "",
      })
      setErrors({})
      setHasConflict(false)
      setConflictDetails(null)
    }
  }, [isOpen])

  const handleCourseChange = (courseCode) => {
    const course = coursesByDepartment[formData.department]?.find((c) => c.code === courseCode)
    if (course) {
      setFormData({
        ...formData,
        courseCode: course.code,
        courseName: course.name,
        credits: course.credits.toString(),
      })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.department) newErrors.department = "Department is required"
        break
      case 2:
        if (!formData.courseCode) newErrors.courseCode = "Course is required"
        if (!formData.program) newErrors.program = "Program is required"
        if (!formData.year) newErrors.year = "Year is required"
        if (!formData.students) newErrors.students = "Number of students is required"
        break
      case 3:
        if (!formData.lecturer) newErrors.lecturer = "Lecturer is required"
        break
      case 4:
        if (!formData.day) newErrors.day = "Day is required"
        if (!formData.startTime) newErrors.startTime = "Start time is required"
        if (!formData.endTime) newErrors.endTime = "End time is required"
        if (!formData.type) newErrors.type = "Type is required"

        // Validate time logic
        if (formData.startTime && formData.endTime) {
          const start = new Date(`2000-01-01 ${formData.startTime}`)
          const end = new Date(`2000-01-01 ${formData.endTime}`)
          if (end <= start) {
            newErrors.endTime = "End time must be after start time"
          }
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkForConflicts = async () => {
    setIsCheckingConflict(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Static conflict detection for demo
    // In real app, this would be an API call
    const hasConflictResult = Math.random() < 0.3 // 30% chance of conflict for demo

    if (hasConflictResult) {
      setHasConflict(true)
      setConflictDetails({
        conflictingCourse: "CSC 2102: Object Oriented Programming",
        conflictingLecturer: "Dr. Sarah Nakato",
        conflictingTime: `${formData.day}, ${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`,
        reason: "Lecturer already has a class scheduled at this time",
      })
    } else {
      setHasConflict(false)
      setConflictDetails(null)
    }

    setIsCheckingConflict(false)
  }

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Check for conflicts before final save
        await checkForConflicts()
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    setHasConflict(false)
    setConflictDetails(null)
  }

  const handleSave = () => {
    if (!hasConflict) {
      onSave(formData)
      onClose()
    }
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getSelectedDepartment = () => departments.find((d) => d.id === formData.department)
  const getSelectedCourse = () => coursesByDepartment[formData.department]?.find((c) => c.code === formData.courseCode)
  const getSelectedLecturer = () =>
    lecturersByDepartment[formData.department]?.find((l) => l.id.toString() === formData.lecturer)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Add New Course
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-2 hidden sm:block">
                <div
                  className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-400"}`}
                >
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        <div className="py-4">
          {/* Step 1: Department Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Department</h3>
                <p className="text-gray-600">Choose the department that will offer this course</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <Card
                    key={dept.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.department === dept.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setFormData({ ...formData, department: dept.id })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Building2
                          className={`w-8 h-8 ${formData.department === dept.id ? "text-blue-600" : "text-gray-400"}`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{dept.name}</h4>
                          <p className="text-sm text-gray-600">{dept.shortName}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.department && <p className="text-sm text-red-500 mt-2">{errors.department}</p>}
            </div>
          )}

          {/* Step 2: Course Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Details</h3>
                <p className="text-gray-600">Select the course and specify program details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="course">Course *</Label>
                  <Select value={formData.courseCode} onValueChange={handleCourseChange}>
                    <SelectTrigger className={errors.courseCode ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesByDepartment[formData.department]?.map((course) => (
                        <SelectItem key={course.code} value={course.code}>
                          {course.code}: {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.courseCode && <p className="text-sm text-red-500 mt-1">{errors.courseCode}</p>}
                </div>

                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    value={formData.credits}
                    readOnly
                    placeholder="Auto-filled"
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="program">Program *</Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => setFormData({ ...formData, program: value })}
                  >
                    <SelectTrigger className={errors.program ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programsByDepartment[formData.department]?.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.program && <p className="text-sm text-red-500 mt-1">{errors.program}</p>}
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                    <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="students">Expected Number of Students *</Label>
                  <Input
                    id="students"
                    type="number"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                    placeholder="Enter expected number of students"
                    className={errors.students ? "border-red-500" : ""}
                  />
                  {errors.students && <p className="text-sm text-red-500 mt-1">{errors.students}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lecturer Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Lecturer</h3>
                <p className="text-gray-600">Choose the lecturer who will teach this course</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {lecturersByDepartment[formData.department]?.map((lecturer) => (
                  <Card
                    key={lecturer.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.lecturer === lecturer.id.toString()
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setFormData({ ...formData, lecturer: lecturer.id.toString() })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap
                          className={`w-8 h-8 ${
                            formData.lecturer === lecturer.id.toString() ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{lecturer.name}</h4>
                          <p className="text-sm text-gray-600">{lecturer.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.lecturer && <p className="text-sm text-red-500 mt-2">{errors.lecturer}</p>}
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Schedule</h3>
                <p className="text-gray-600">Define when this course will be taught</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="day">Day *</Label>
                  <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                    <SelectTrigger className={errors.day ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.day && <p className="text-sm text-red-500 mt-1">{errors.day}</p>}
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                  >
                    <SelectTrigger className={errors.startTime ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime}</p>}
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Select
                    value={formData.endTime}
                    onValueChange={(value) => setFormData({ ...formData, endTime: value })}
                  >
                    <SelectTrigger className={errors.endTime ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.endTime && <p className="text-sm text-red-500 mt-1">{errors.endTime}</p>}
                </div>
              </div>

              {/* Course Summary */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Course Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Department:</strong> {getSelectedDepartment()?.name}
                    </div>
                    <div>
                      <strong>Course:</strong> {getSelectedCourse()?.code} - {getSelectedCourse()?.name}
                    </div>
                    <div>
                      <strong>Program:</strong> {formData.program}
                    </div>
                    <div>
                      <strong>Year:</strong> {formData.year}
                    </div>
                    <div>
                      <strong>Lecturer:</strong> {getSelectedLecturer()?.name}
                    </div>
                    <div>
                      <strong>Students:</strong> {formData.students}
                    </div>
                    <div>
                      <strong>Schedule:</strong> {formData.day}, {formData.startTime && formatTime(formData.startTime)}{" "}
                      - {formData.endTime && formatTime(formData.endTime)}
                    </div>
                    <div>
                      <strong>Type:</strong> {formData.type}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conflict Check Results */}
              {isCheckingConflict && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Clock className="w-5 h-5 animate-spin" />
                      <span>Checking for schedule conflicts...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isCheckingConflict && hasConflict && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 text-red-800">
                      <AlertTriangle className="w-5 h-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-2">Schedule Conflict Detected</h4>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Conflicting Course:</strong> {conflictDetails?.conflictingCourse}
                          </p>
                          <p>
                            <strong>Conflicting Lecturer:</strong> {conflictDetails?.conflictingLecturer}
                          </p>
                          <p>
                            <strong>Time:</strong> {conflictDetails?.conflictingTime}
                          </p>
                          <p>
                            <strong>Reason:</strong> {conflictDetails?.reason}
                          </p>
                        </div>
                        <p className="mt-2 text-sm">Please select a different time slot or lecturer.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isCheckingConflict && !hasConflict && formData.day && formData.startTime && formData.endTime && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span>No conflicts detected. Ready to save!</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={isCheckingConflict ? undefined : hasConflict ? handleNext : handleSave}
                disabled={isCheckingConflict || hasConflict}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCheckingConflict ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : hasConflict ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Resolve Conflict
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Course
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



/* 
  I need you to help me modify the above code once again. On the part for Add New Course, It should start with Selecting a department, then on the section for course, a user should be able to manually type in the couse name, then instead of program, let it be Course Description, where the user can type in a simple paragraph. then remove the field of expected number of students and that of year. then upon clicking next, we should go to the lecturer selection section. Here, the user finds the similar list of lecturers who belong to the department that was selected earlier. The user selects the lecturers that are qualified to teach this course. these should be saved along with the other data     private String id;
    private String courseCode;
    private String courseName;
    private int credits;
    @DBRef
    private List<Instructor> qualifiedInstructors;
    @DBRef
    private String departmentId; 
So upo selecting the lecturers, the continuation button should be Save, I dont want the next section of 'Schedule' to be there

I know some of this logic needs modicifation of other files. I will try to provide them as you need or ask
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Save,
  X,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Building2,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
} from "lucide-react"

export function CourseCreationModal({ isOpen, onClose, onSave, existingCourses = [] }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    department: "",
    courseCode: "",
    courseName: "",
    credits: "",
    program: "",
    year: "",
    lecturer: "",
    day: "",
    startTime: "",
    endTime: "",
    type: "",
    students: "",
  })
  const [errors, setErrors] = useState({})
  const [isCheckingConflict, setIsCheckingConflict] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictDetails, setConflictDetails] = useState(null)

  // Sample data - in real app this would come from API
  const departments = [
    { id: "business", name: "School of Business", shortName: "Business" },
    { id: "science", name: "School of Science & Technology", shortName: "Science & Technology" },
    { id: "education", name: "School of Education", shortName: "Education" },
    { id: "theology", name: "School of Theology", shortName: "Theology" },
    { id: "health", name: "School of Health Sciences", shortName: "Health Sciences" },
    { id: "agriculture", name: "School of Agriculture", shortName: "Agriculture" },
  ]

  const coursesByDepartment = {
    business: [
      { code: "BBA 1101", name: "Introduction to Business", credits: 3 },
      { code: "BBA 2201", name: "Marketing Principles", credits: 4 },
      { code: "BBA 3201", name: "Strategic Management", credits: 4 },
      { code: "BCOM 2101", name: "Financial Accounting", credits: 3 },
    ],
    science: [
      { code: "CSC 1101", name: "Introduction to Programming", credits: 4 },
      { code: "CSC 2101", name: "Data Structures and Algorithms", credits: 3 },
      { code: "CSC 2102", name: "Object Oriented Programming", credits: 4 },
      { code: "CSC 3201", name: "Advanced Algorithms", credits: 4 },
      { code: "IT 2101", name: "Database Systems", credits: 3 },
    ],
    education: [
      { code: "EDU 1101", name: "Foundations of Education", credits: 3 },
      { code: "EDU 2105", name: "Educational Psychology", credits: 3 },
      { code: "EDU 3201", name: "Curriculum Development", credits: 4 },
    ],
    theology: [
      { code: "TH 1101", name: "Biblical Studies", credits: 3 },
      { code: "TH 2201", name: "Systematic Theology", credits: 4 },
    ],
    health: [
      { code: "NSG 1101", name: "Fundamentals of Nursing", credits: 4 },
      { code: "PH 2101", name: "Public Health Principles", credits: 3 },
    ],
    agriculture: [
      { code: "AGR 1101", name: "Introduction to Agriculture", credits: 3 },
      { code: "AGR 2201", name: "Crop Production", credits: 4 },
    ],
  }

  const programsByDepartment = {
    business: ["Bachelor of Business Administration", "Bachelor of Commerce", "Master of Business Administration"],
    science: ["Bachelor of Computer Science", "Bachelor of Information Technology", "Bachelor of Engineering"],
    education: ["Bachelor of Education", "Master of Education", "Diploma in Education"],
    theology: ["Bachelor of Theology", "Master of Theology", "Diploma in Theology"],
    health: ["Bachelor of Nursing", "Bachelor of Public Health", "Diploma in Nursing"],
    agriculture: ["Bachelor of Agriculture", "Bachelor of Agribusiness", "Diploma in Agriculture"],
  }

  const lecturersByDepartment = {
    business: [
      { id: 1, name: "Prof. Mary Kisakye", email: "m.kisakye@bugema.ac.ug" },
      { id: 2, name: "Dr. James Okello", email: "j.okello@bugema.ac.ug" },
    ],
    science: [
      { id: 3, name: "Dr. Sarah Nakato", email: "s.nakato@bugema.ac.ug" },
      { id: 4, name: "Mr. Peter Musoke", email: "p.musoke@bugema.ac.ug" },
    ],
    education: [
      { id: 5, name: "Dr. Peter Musoke", email: "p.musoke@bugema.ac.ug" },
      { id: 6, name: "Ms. Grace Namukasa", email: "g.namukasa@bugema.ac.ug" },
    ],
    theology: [{ id: 7, name: "Rev. Dr. John Ssemakula", email: "j.ssemakula@bugema.ac.ug" }],
    health: [{ id: 8, name: "Dr. Grace Namukasa", email: "g.namukasa@bugema.ac.ug" }],
    agriculture: [{ id: 9, name: "Prof. James Okello", email: "j.okello@bugema.ac.ug" }],
  }

  const years = ["Year 1", "Year 2", "Year 3", "Year 4"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const types = ["Lecture", "Practical", "Tutorial"]

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 7; hour <= 18; hour++) {
      options.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour < 18) {
        options.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const steps = [
    { number: 1, title: "Department", icon: Building2 },
    { number: 2, title: "Course", icon: BookOpen },
    { number: 3, title: "Lecturer", icon: GraduationCap },
    { number: 4, title: "Schedule", icon: Calendar },
  ]

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setFormData({
        department: "",
        courseCode: "",
        courseName: "",
        credits: "",
        program: "",
        year: "",
        lecturer: "",
        day: "",
        startTime: "",
        endTime: "",
        type: "",
        students: "",
      })
      setErrors({})
      setHasConflict(false)
      setConflictDetails(null)
    }
  }, [isOpen])

  const handleCourseChange = (courseCode) => {
    const course = coursesByDepartment[formData.department]?.find((c) => c.code === courseCode)
    if (course) {
      setFormData({
        ...formData,
        courseCode: course.code,
        courseName: course.name,
        credits: course.credits.toString(),
      })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.department) newErrors.department = "Department is required"
        break
      case 2:
        if (!formData.courseCode) newErrors.courseCode = "Course is required"
        if (!formData.program) newErrors.program = "Program is required"
        if (!formData.year) newErrors.year = "Year is required"
        if (!formData.students) newErrors.students = "Number of students is required"
        break
      case 3:
        if (!formData.lecturer) newErrors.lecturer = "Lecturer is required"
        break
      case 4:
        if (!formData.day) newErrors.day = "Day is required"
        if (!formData.startTime) newErrors.startTime = "Start time is required"
        if (!formData.endTime) newErrors.endTime = "End time is required"
        if (!formData.type) newErrors.type = "Type is required"

        // Validate time logic
        if (formData.startTime && formData.endTime) {
          const start = new Date(`2000-01-01 ${formData.startTime}`)
          const end = new Date(`2000-01-01 ${formData.endTime}`)
          if (end <= start) {
            newErrors.endTime = "End time must be after start time"
          }
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkForConflicts = async () => {
    setIsCheckingConflict(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Static conflict detection for demo
    // In real app, this would be an API call
    const hasConflictResult = Math.random() < 0.3 // 30% chance of conflict for demo

    if (hasConflictResult) {
      setHasConflict(true)
      setConflictDetails({
        conflictingCourse: "CSC 2102: Object Oriented Programming",
        conflictingLecturer: "Dr. Sarah Nakato",
        conflictingTime: `${formData.day}, ${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`,
        reason: "Lecturer already has a class scheduled at this time",
      })
    } else {
      setHasConflict(false)
      setConflictDetails(null)
    }

    setIsCheckingConflict(false)
  }

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Check for conflicts before final save
        await checkForConflicts()
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    setHasConflict(false)
    setConflictDetails(null)
  }

  const handleSave = () => {
    if (!hasConflict) {
      onSave(formData)
      onClose()
    }
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getSelectedDepartment = () => departments.find((d) => d.id === formData.department)
  const getSelectedCourse = () => coursesByDepartment[formData.department]?.find((c) => c.code === formData.courseCode)
  const getSelectedLecturer = () =>
    lecturersByDepartment[formData.department]?.find((l) => l.id.toString() === formData.lecturer)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Add New Course
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
//         <div className="flex items-center justify-between mb-6 px-4">
//           {steps.map((step, index) => (
//             <div key={step.number} className="flex items-center">
//               <div
//                 className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
//                   currentStep >= step.number
//                     ? "bg-blue-600 border-blue-600 text-white"
//                     : "border-gray-300 text-gray-400"
//                 }`}
//               >
//                 <step.icon className="w-5 h-5" />
//               </div>
//               <div className="ml-2 hidden sm:block">
//                 <div
//                   className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-400"}`}
//                 >
//                   {step.title}
//                 </div>
//               </div>
//               {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />}
//             </div>
//           ))}
//         </div>

//         <div className="py-4">
//           {/* Step 1: Department Selection */}
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <div className="text-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Department</h3>
//                 <p className="text-gray-600">Choose the department that will offer this course</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {departments.map((dept) => (
//                   <Card
//                     key={dept.id}
//                     className={`cursor-pointer transition-all hover:shadow-md ${
//                       formData.department === dept.id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-blue-300"
//                     }`}
//                     onClick={() => setFormData({ ...formData, department: dept.id })}
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-3">
//                         <Building2
//                           className={`w-8 h-8 ${formData.department === dept.id ? "text-blue-600" : "text-gray-400"}`}
//                         />
//                         <div>
//                           <h4 className="font-medium text-gray-900">{dept.name}</h4>
//                           <p className="text-sm text-gray-600">{dept.shortName}</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//               {errors.department && <p className="text-sm text-red-500 mt-2">{errors.department}</p>}
//             </div>
//           )}

//           {/* Step 2: Course Details */}
//           {currentStep === 2 && (
//             <div className="space-y-6">
//               <div className="text-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Details</h3>
//                 <p className="text-gray-600">Select the course and specify program details</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="course">Course *</Label>
//                   <Select value={formData.courseCode} onValueChange={handleCourseChange}>
//                     <SelectTrigger className={errors.courseCode ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select course" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {coursesByDepartment[formData.department]?.map((course) => (
//                         <SelectItem key={course.code} value={course.code}>
//                           {course.code}: {course.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.courseCode && <p className="text-sm text-red-500 mt-1">{errors.courseCode}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="credits">Credits</Label>
//                   <Input
//                     id="credits"
//                     value={formData.credits}
//                     readOnly
//                     placeholder="Auto-filled"
//                     className="bg-gray-50"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="program">Program *</Label>
//                   <Select
//                     value={formData.program}
//                     onValueChange={(value) => setFormData({ ...formData, program: value })}
//                   >
//                     <SelectTrigger className={errors.program ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select program" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {programsByDepartment[formData.department]?.map((program) => (
//                         <SelectItem key={program} value={program}>
//                           {program}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.program && <p className="text-sm text-red-500 mt-1">{errors.program}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="year">Year *</Label>
//                   <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
//                     <SelectTrigger className={errors.year ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select year" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {years.map((year) => (
//                         <SelectItem key={year} value={year}>
//                           {year}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
//                 </div>

//                 <div className="md:col-span-2">
//                   <Label htmlFor="students">Expected Number of Students *</Label>
//                   <Input
//                     id="students"
//                     type="number"
//                     value={formData.students}
//                     onChange={(e) => setFormData({ ...formData, students: e.target.value })}
//                     placeholder="Enter expected number of students"
//                     className={errors.students ? "border-red-500" : ""}
//                   />
//                   {errors.students && <p className="text-sm text-red-500 mt-1">{errors.students}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Lecturer Selection */}
//           {currentStep === 3 && (
//             <div className="space-y-6">
//               <div className="text-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Lecturer</h3>
//                 <p className="text-gray-600">Choose the lecturer who will teach this course</p>
//               </div>

//               <div className="grid grid-cols-1 gap-4">
//                 {lecturersByDepartment[formData.department]?.map((lecturer) => (
//                   <Card
//                     key={lecturer.id}
//                     className={`cursor-pointer transition-all hover:shadow-md ${
//                       formData.lecturer === lecturer.id.toString()
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-blue-300"
//                     }`}
//                     onClick={() => setFormData({ ...formData, lecturer: lecturer.id.toString() })}
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-3">
//                         <GraduationCap
//                           className={`w-8 h-8 ${
//                             formData.lecturer === lecturer.id.toString() ? "text-blue-600" : "text-gray-400"
//                           }`}
//                         />
//                         <div>
//                           <h4 className="font-medium text-gray-900">{lecturer.name}</h4>
//                           <p className="text-sm text-gray-600">{lecturer.email}</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//               {errors.lecturer && <p className="text-sm text-red-500 mt-2">{errors.lecturer}</p>}
//             </div>
//           )}

//           {/* Step 4: Schedule */}
//           {currentStep === 4 && (
//             <div className="space-y-6">
//               <div className="text-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Schedule</h3>
//                 <p className="text-gray-600">Define when this course will be taught</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="day">Day *</Label>
//                   <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
//                     <SelectTrigger className={errors.day ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select day" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {days.map((day) => (
//                         <SelectItem key={day} value={day}>
//                           {day}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.day && <p className="text-sm text-red-500 mt-1">{errors.day}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="type">Type *</Label>
//                   <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
//                     <SelectTrigger className={errors.type ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {types.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="startTime">Start Time *</Label>
//                   <Select
//                     value={formData.startTime}
//                     onValueChange={(value) => setFormData({ ...formData, startTime: value })}
//                   >
//                     <SelectTrigger className={errors.startTime ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select start time" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {timeOptions.map((time) => (
//                         <SelectItem key={time} value={time}>
//                           {formatTime(time)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="endTime">End Time *</Label>
//                   <Select
//                     value={formData.endTime}
//                     onValueChange={(value) => setFormData({ ...formData, endTime: value })}
//                   >
//                     <SelectTrigger className={errors.endTime ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select end time" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {timeOptions.map((time) => (
//                         <SelectItem key={time} value={time}>
//                           {formatTime(time)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.endTime && <p className="text-sm text-red-500 mt-1">{errors.endTime}</p>}
//                 </div>
//               </div>

//               {/* Course Summary */}
//               <Card className="bg-gray-50 border-gray-200">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Course Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <strong>Department:</strong> {getSelectedDepartment()?.name}
//                     </div>
//                     <div>
//                       <strong>Course:</strong> {getSelectedCourse()?.code} - {getSelectedCourse()?.name}
//                     </div>
//                     <div>
//                       <strong>Program:</strong> {formData.program}
//                     </div>
//                     <div>
//                       <strong>Year:</strong> {formData.year}
//                     </div>
//                     <div>
//                       <strong>Lecturer:</strong> {getSelectedLecturer()?.name}
//                     </div>
//                     <div>
//                       <strong>Students:</strong> {formData.students}
//                     </div>
//                     <div>
//                       <strong>Schedule:</strong> {formData.day}, {formData.startTime && formatTime(formData.startTime)}{" "}
//                       - {formData.endTime && formatTime(formData.endTime)}
//                     </div>
//                     <div>
//                       <strong>Type:</strong> {formData.type}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Conflict Check Results */}
//               {isCheckingConflict && (
//                 <Card className="border-yellow-200 bg-yellow-50">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-2 text-yellow-800">
//                       <Clock className="w-5 h-5 animate-spin" />
//                       <span>Checking for schedule conflicts...</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {!isCheckingConflict && hasConflict && (
//                 <Card className="border-red-200 bg-red-50">
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-2 text-red-800">
//                       <AlertTriangle className="w-5 h-5 mt-0.5" />
//                       <div>
//                         <h4 className="font-medium mb-2">Schedule Conflict Detected</h4>
//                         <div className="text-sm space-y-1">
//                           <p>
//                             <strong>Conflicting Course:</strong> {conflictDetails?.conflictingCourse}
//                           </p>
//                           <p>
//                             <strong>Conflicting Lecturer:</strong> {conflictDetails?.conflictingLecturer}
//                           </p>
//                           <p>
//                             <strong>Time:</strong> {conflictDetails?.conflictingTime}
//                           </p>
//                           <p>
//                             <strong>Reason:</strong> {conflictDetails?.reason}
//                           </p>
//                         </div>
//                         <p className="mt-2 text-sm">Please select a different time slot or lecturer.</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {!isCheckingConflict && !hasConflict && formData.day && formData.startTime && formData.endTime && (
//                 <Card className="border-green-200 bg-green-50">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-2 text-green-800">
//                       <CheckCircle className="w-5 h-5" />
//                       <span>No conflicts detected. Ready to save!</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           )}
//         </div>

//         <DialogFooter className="flex justify-between">
//           <div>
//             {currentStep > 1 && (
//               <Button variant="outline" onClick={handlePrevious}>
//                 <ChevronLeft className="w-4 h-4 mr-2" />
//                 Previous
//               </Button>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={onClose}>
//               <X className="w-4 h-4 mr-2" />
//               Cancel
//             </Button>
//             {currentStep < 4 ? (
//               <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
//                 Next
//                 <ChevronRight className="w-4 h-4 ml-2" />
//               </Button>
//             ) : (
//               <Button
//                 onClick={isCheckingConflict ? undefined : hasConflict ? handleNext : handleSave}
//                 disabled={isCheckingConflict || hasConflict}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 {isCheckingConflict ? (
//                   <>
//                     <Clock className="w-4 h-4 mr-2 animate-spin" />
//                     Checking...
//                   </>
//                 ) : hasConflict ? (
//                   <>
//                     <AlertTriangle className="w-4 h-4 mr-2" />
//                     Resolve Conflict
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     Save Course
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
*/



