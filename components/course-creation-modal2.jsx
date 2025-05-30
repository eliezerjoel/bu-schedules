"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, X, ChevronRight, ChevronLeft, CheckCircle, Building2, BookOpen, GraduationCap } from "lucide-react"

export function CourseCreationModal({ isOpen, onClose, onSave }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    departmentId: "",
    courseCode: "",
    courseName: "",
    courseDescription: "",
    credits: "",
    qualifiedInstructors: [],
  })
  const [errors, setErrors] = useState({})



  /**
   * 
  const [_departments, set_Departments] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8080/api/departments")
        .then((res) => res.json())
        .then((data) => setDepartments(data))
        .catch(() => setDepartments([]))
    }
  }, [isOpen])
   */

  // Sample data - in real app this would come from API
  const departments = [
    { id: "business", name: "School of Business", shortName: "Business" },
    { id: "science", name: "School of Science & Technology", shortName: "Science & Technology" },
    { id: "education", name: "School of Education", shortName: "Education" },
    { id: "theology", name: "School of Theology", shortName: "Theology" },
    { id: "health", name: "School of Health Sciences", shortName: "Health Sciences" },
    { id: "agriculture", name: "School of Agriculture", shortName: "Agriculture" },
  ]

  const lecturersByDepartment = {
    business: [
      {
        id: "1",
        name: "Prof. Mary Kisakye",
        email: "m.kisakye@bugema.ac.ug",
        specialization: "Business Administration",
      },
      { id: "2", name: "Dr. James Okello", email: "j.okello@bugema.ac.ug", specialization: "Finance & Accounting" },
      { id: "3", name: "Ms. Sarah Nakamya", email: "s.nakamya@bugema.ac.ug", specialization: "Marketing" },
      { id: "4", name: "Mr. David Ssebunya", email: "d.ssebunya@bugema.ac.ug", specialization: "Management" },
    ],
    science: [
      { id: "5", name: "Dr. Sarah Nakato", email: "s.nakato@bugema.ac.ug", specialization: "Computer Science" },
      { id: "6", name: "Mr. Peter Musoke", email: "p.musoke@bugema.ac.ug", specialization: "Information Technology" },
      {
        id: "7",
        name: "Dr. Michael Kiwanuka",
        email: "m.kiwanuka@bugema.ac.ug",
        specialization: "Software Engineering",
      },
      { id: "8", name: "Ms. Grace Nambi", email: "g.nambi@bugema.ac.ug", specialization: "Data Science" },
    ],
    education: [
      { id: "9", name: "Dr. Peter Musoke", email: "p.musoke@bugema.ac.ug", specialization: "Educational Psychology" },
      {
        id: "10",
        name: "Ms. Grace Namukasa",
        email: "g.namukasa@bugema.ac.ug",
        specialization: "Curriculum Development",
      },
      {
        id: "11",
        name: "Prof. John Ssemakula",
        email: "j.ssemakula@bugema.ac.ug",
        specialization: "Educational Leadership",
      },
    ],
    theology: [
      {
        id: "12",
        name: "Rev. Dr. John Ssemakula",
        email: "j.ssemakula@bugema.ac.ug",
        specialization: "Biblical Studies",
      },
      { id: "13", name: "Dr. Mary Namusoke", email: "m.namusoke@bugema.ac.ug", specialization: "Systematic Theology" },
    ],
    health: [
      { id: "14", name: "Dr. Grace Namukasa", email: "g.namukasa@bugema.ac.ug", specialization: "Public Health" },
      { id: "15", name: "Ms. Susan Nakato", email: "s.nakato@bugema.ac.ug", specialization: "Nursing" },
      { id: "16", name: "Dr. Robert Kiggundu", email: "r.kiggundu@bugema.ac.ug", specialization: "Community Health" },
    ],
    agriculture: [
      { id: "17", name: "Prof. James Okello", email: "j.okello@bugema.ac.ug", specialization: "Crop Science" },
      { id: "18", name: "Dr. Alice Namukasa", email: "a.namukasa@bugema.ac.ug", specialization: "Animal Science" },
      {
        id: "19",
        name: "Mr. Paul Ssebugwawo",
        email: "p.ssebugwawo@bugema.ac.ug",
        specialization: "Agricultural Economics",
      },
    ],
  }

  const steps = [
    { number: 1, title: "Department", icon: Building2 },
    { number: 2, title: "Course Details", icon: BookOpen },
    { number: 3, title: "Lecturers", icon: GraduationCap },
  ]

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setFormData({
        departmentId: "",
        courseCode: "",
        courseName: "",
        courseDescription: "",
        credits: "",
        qualifiedInstructors: [],
      })
      setErrors({})
    }
  }, [isOpen])

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.departmentId) newErrors.departmentId = "Department is required"
        break
      case 2:
        if (!formData.courseCode) newErrors.courseCode = "Course code is required"
        if (!formData.courseName) newErrors.courseName = "Course name is required"
        if (!formData.courseDescription) newErrors.courseDescription = "Course description is required"
        if (!formData.credits) newErrors.credits = "Credits is required"
        if (
          formData.credits &&
          (isNaN(formData.credits) || Number.parseInt(formData.credits) < 1 || Number.parseInt(formData.credits) > 6)
        ) {
          newErrors.credits = "Credits must be a number between 1 and 6"
        }
        break
      case 3:
        if (formData.qualifiedInstructors.length === 0) {
          newErrors.qualifiedInstructors = "At least one lecturer must be selected"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSave = () => {
    if (validateStep(currentStep)) {
      // Convert credits to number and prepare data for saving
      const courseData = {
        ...formData,
        credits: Number.parseInt(formData.credits),
        id: `course_${Date.now()}`, // Generate a temporary ID
      }
      onSave(courseData)
      onClose()
    }
  }

  const handleLecturerToggle = (lecturerId) => {
    const currentInstructors = formData.qualifiedInstructors
    const isSelected = currentInstructors.includes(lecturerId)

    if (isSelected) {
      setFormData({
        ...formData,
        qualifiedInstructors: currentInstructors.filter((id) => id !== lecturerId),
      })
    } else {
      setFormData({
        ...formData,
        qualifiedInstructors: [...currentInstructors, lecturerId],
      })
    }
  }

  const getSelectedDepartment = () => departments.find((d) => d.id === formData.departmentId)
  const getSelectedLecturers = () => {
    const departmentLecturers = lecturersByDepartment[formData.departmentId] || []
    return departmentLecturers.filter((lecturer) => formData.qualifiedInstructors.includes(lecturer.id))
  }

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
                      formData.departmentId === dept.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setFormData({ ...formData, departmentId: dept.id, qualifiedInstructors: [] })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Building2
                          className={`w-8 h-8 ${formData.departmentId === dept.id ? "text-blue-600" : "text-gray-400"}`}
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
              {errors.departmentId && <p className="text-sm text-red-500 mt-2">{errors.departmentId}</p>}
            </div>
          )}

          {/* Step 2: Course Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Details</h3>
                <p className="text-gray-600">Enter the course information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="courseCode">Course Code *</Label>
                  <Input
                    id="courseCode"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSC 1101"
                    className={errors.courseCode ? "border-red-500" : ""}
                  />
                  {errors.courseCode && <p className="text-sm text-red-500 mt-1">{errors.courseCode}</p>}
                </div>

                <div>
                  <Label htmlFor="credits">Credits *</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="e.g., 3"
                    className={errors.credits ? "border-red-500" : ""}
                  />
                  {errors.credits && <p className="text-sm text-red-500 mt-1">{errors.credits}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="e.g., Introduction to Programming"
                    className={errors.courseName ? "border-red-500" : ""}
                  />
                  {errors.courseName && <p className="text-sm text-red-500 mt-1">{errors.courseName}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="courseDescription">Course Description *</Label>
                  <Textarea
                    id="courseDescription"
                    value={formData.courseDescription}
                    onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                    placeholder="Enter a detailed description of the course content, objectives, and learning outcomes..."
                    className={`min-h-[120px] ${errors.courseDescription ? "border-red-500" : ""}`}
                  />
                  {errors.courseDescription && <p className="text-sm text-red-500 mt-1">{errors.courseDescription}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lecturer Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Qualified Lecturers</h3>
                <p className="text-gray-600">Choose the lecturers who are qualified to teach this course</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {lecturersByDepartment[formData.departmentId]?.map((lecturer) => (
                  <Card
                    key={lecturer.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.qualifiedInstructors.includes(lecturer.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleLecturerToggle(lecturer.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.qualifiedInstructors.includes(lecturer.id)}
                          onChange={() => handleLecturerToggle(lecturer.id)}
                          className="pointer-events-none"
                        />
                        <GraduationCap
                          className={`w-8 h-8 ${
                            formData.qualifiedInstructors.includes(lecturer.id) ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{lecturer.name}</h4>
                          <p className="text-sm text-gray-600">{lecturer.email}</p>
                          <p className="text-sm text-blue-600 font-medium">{lecturer.specialization}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.qualifiedInstructors && (
                <p className="text-sm text-red-500 mt-2">{errors.qualifiedInstructors}</p>
              )}

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
                      <strong>Course Code:</strong> {formData.courseCode}
                    </div>
                    <div>
                      <strong>Course Name:</strong> {formData.courseName}
                    </div>
                    <div>
                      <strong>Credits:</strong> {formData.credits}
                    </div>
                    <div className="md:col-span-2">
                      <strong>Description:</strong> {formData.courseDescription}
                    </div>
                    <div className="md:col-span-2">
                      <strong>Qualified Lecturers:</strong>{" "}
                      {getSelectedLecturers()
                        .map((lecturer) => lecturer.name)
                        .join(", ") || "None selected"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {formData.qualifiedInstructors.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        Ready to save course with {formData.qualifiedInstructors.length} qualified lecturer(s)!
                      </span>
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
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={formData.qualifiedInstructors.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Course
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
