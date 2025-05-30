"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Save, X, Plus, BookOpen, Building2, User } from "lucide-react"

export function LecturerCreationModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    courses: [],
  })
  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch departments and courses
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        courses: [],
      })
      setErrors({})
      fetch("http://localhost:8080/api/departments")
        .then((res) => res.json())
        .then(setDepartments)
        .catch(() => setDepartments([]))
      fetch("http://localhost:8080/api/courses")
        .then((res) => res.json())
        .then(setCourses)
        .catch(() => setCourses([]))
    }
  }, [isOpen])

  const validate = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.courses.length) newErrors.courses = "Select at least one course"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch("http://localhost:8080/api/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setLoading(false)
      onCreated?.()
      onClose()
    } catch {
      setLoading(false)
      setErrors({ submit: "Failed to create lecturer" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6 text-green-600" />
            Add New Lecturer
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value, courses: [] })}
            >
              <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id || dept._id} value={dept.id || dept._id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
          </div>
          <div>
            <Label htmlFor="courses">Courses *</Label>
            <Select
              multiple
              value={formData.courses}
              onValueChange={(value) => setFormData({ ...formData, courses: value })}
            >
              <SelectTrigger className={errors.courses ? "border-red-500" : ""}>
                <SelectValue placeholder="Select courses" />
              </SelectTrigger>
              <SelectContent>
                {courses
                  .filter((c) => !formData.department || c.departmentId === formData.department)
                  .map((course) => (
                    <SelectItem key={course.id || course._id} value={course.id || course._id}>
                      {course.courseCode}: {course.courseName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.courses && <p className="text-xs text-red-500">{errors.courses}</p>}
          </div>
          {errors.submit && <p className="text-xs text-red-500">{errors.submit}</p>}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Lecturer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}