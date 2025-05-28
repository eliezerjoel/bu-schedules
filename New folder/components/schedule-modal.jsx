"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertTriangle, Save, Trash2, X } from "lucide-react"

export function ScheduleModal({ isOpen, onClose, onSave, mode, schedule, timeSlot, lecturer }) {
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    program: "",
    year: "",
    day: "",
    startTime: "",
    endTime: "",
    type: "",
    students: "",
    credits: "",
  })

  const [errors, setErrors] = useState({})

  // Sample data - in real app this would come from API
  const courses = [
    { code: "CSC 1101", name: "Introduction to Programming", credits: 4 },
    { code: "CSC 2101", name: "Data Structures and Algorithms", credits: 3 },
    { code: "CSC 2102", name: "Object Oriented Programming", credits: 4 },
    { code: "CSC 2103", name: "Database Systems", credits: 3 },
    { code: "CSC 2104", name: "Computer Networks", credits: 3 },
    { code: "CSC 3201", name: "Advanced Algorithms", credits: 4 },
    { code: "MTH 2201", name: "Discrete Mathematics", credits: 3 },
    { code: "GEN 2001", name: "Communication Skills", credits: 2 },
  ]

  const programs = ["Bachelor of Computer Science", "Bachelor of Information Technology", "Bachelor of Engineering"]

  const years = ["Year 1", "Year 2", "Year 3", "Year 4"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const types = ["Lecture", "Practical", "Tutorial"]

  useEffect(() => {
    if (mode === "edit" && schedule) {
      setFormData(schedule)
    } else if (mode === "create" && timeSlot) {
      setFormData({
        courseCode: "",
        courseName: "",
        program: "",
        year: "",
        day: timeSlot.day,
        startTime: timeSlot.timeSlot,
        endTime: "",
        type: "",
        students: "",
        credits: "",
      })
    } else {
      setFormData({
        courseCode: "",
        courseName: "",
        program: "",
        year: "",
        day: "",
        startTime: "",
        endTime: "",
        type: "",
        students: "",
        credits: "",
      })
    }
    setErrors({})
  }, [mode, schedule, timeSlot, isOpen])

  const handleCourseChange = (courseCode) => {
    const course = courses.find((c) => c.code === courseCode)
    if (course) {
      setFormData({
        ...formData,
        courseCode: course.code,
        courseName: course.name,
        credits: course.credits.toString(),
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.courseCode) newErrors.courseCode = "Course is required"
    if (!formData.program) newErrors.program = "Program is required"
    if (!formData.year) newErrors.year = "Year is required"
    if (!formData.day) newErrors.day = "Day is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.endTime) newErrors.endTime = "End time is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.students) newErrors.students = "Number of students is required"

    // Validate time logic
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01 ${formData.startTime}`)
      const end = new Date(`2000-01-01 ${formData.endTime}`)
      if (end <= start) {
        newErrors.endTime = "End time must be after start time"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleDelete = () => {
    onSave(null) // Signal deletion
  }

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

  if (mode === "delete") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Schedule
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Are you sure you want to delete this schedule?</p>
            {schedule && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">
                  {schedule.courseCode}: {schedule.courseName}
                </div>
                <div className="text-sm text-gray-600">
                  {schedule.day}, {schedule.startTime} - {schedule.endTime}
                </div>
                <div className="text-sm text-gray-600">
                  {schedule.program} - {schedule.year}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? "Create New Schedule" : "Edit Schedule"}
            <span className="text-sm font-normal text-gray-600">for {lecturer.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Course Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Course *</Label>
              <Select value={formData.courseCode} onValueChange={handleCourseChange}>
                <SelectTrigger className={errors.courseCode ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
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
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="Credits"
                readOnly
              />
            </div>
          </div>

          {/* Program and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="program">Program *</Label>
              <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
                <SelectTrigger className={errors.program ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
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
          </div>

          {/* Day and Type */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
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
                      {new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <Select value={formData.endTime} onValueChange={(value) => setFormData({ ...formData, endTime: value })}>
                <SelectTrigger className={errors.endTime ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endTime && <p className="text-sm text-red-500 mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Students */}
          <div>
            <Label htmlFor="students">Number of Students *</Label>
            <Input
              id="students"
              type="number"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: e.target.value })}
              placeholder="Enter number of students"
              className={errors.students ? "border-red-500" : ""}
            />
            {errors.students && <p className="text-sm text-red-500 mt-1">{errors.students}</p>}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {mode === "edit" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setFormData(schedule)
                  onClose()
                  setTimeout(() => {
                    onSave(null)
                  }, 100)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Schedule" : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
