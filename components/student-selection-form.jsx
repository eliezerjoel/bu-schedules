"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, GraduationCap, Building2, BookOpen } from "lucide-react"

export function StudentSelectionForm() {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  // Sample data - in real app this would come from API
  const departments = [
    { id: "business", name: "School of Business" },
    { id: "education", name: "School of Education" },
    { id: "theology", name: "School of Theology" },
    { id: "science", name: "School of Science & Technology" },
    { id: "health", name: "School of Health Sciences" },
    { id: "agriculture", name: "School of Agriculture" },
  ]

  const programsByDepartment = {
    business: [
      { id: "bba", name: "Bachelor of Business Administration" },
      { id: "bcom", name: "Bachelor of Commerce" },
      { id: "mba", name: "Master of Business Administration" },
    ],
    education: [
      { id: "bed", name: "Bachelor of Education" },
      { id: "med", name: "Master of Education" },
      { id: "diploma-ed", name: "Diploma in Education" },
    ],
    theology: [
      { id: "bth", name: "Bachelor of Theology" },
      { id: "mth", name: "Master of Theology" },
      { id: "diploma-th", name: "Diploma in Theology" },
    ],
    science: [
      { id: "bsc-cs", name: "Bachelor of Computer Science" },
      { id: "bsc-it", name: "Bachelor of Information Technology" },
      { id: "beng", name: "Bachelor of Engineering" },
    ],
    health: [
      { id: "bsc-nursing", name: "Bachelor of Nursing" },
      { id: "bsc-public-health", name: "Bachelor of Public Health" },
      { id: "diploma-nursing", name: "Diploma in Nursing" },
    ],
    agriculture: [
      { id: "bsc-agric", name: "Bachelor of Agriculture" },
      { id: "bsc-agribusiness", name: "Bachelor of Agribusiness" },
      { id: "diploma-agric", name: "Diploma in Agriculture" },
    ],
  }

  const years = [
    { id: "1", name: "Year 1" },
    { id: "2", name: "Year 2" },
    { id: "3", name: "Year 3" },
    { id: "4", name: "Year 4" },
    { id: "5", name: "Year 5" },
  ]

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value)
    setSelectedProgram("") // Reset program when department changes
    setSelectedYear("") // Reset year when department changes
  }

  const handleSubmit = () => {
    if (selectedDepartment && selectedProgram && selectedYear) {
      // In real app, this would navigate to timetable page with selected parameters
      console.log("Selected:", { selectedDepartment, selectedProgram, selectedYear })
      alert(`Viewing timetable for ${selectedProgram} - ${selectedYear}`)
    }
  }

  const isFormComplete = selectedDepartment && selectedProgram && selectedYear

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="w-6 h-6" />
            Select Your Academic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Department/School
            </Label>
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Program Selection */}
          <div className="space-y-2">
            <Label htmlFor="program" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Program
            </Label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram} disabled={!selectedDepartment}>
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder={selectedDepartment ? "Select your program" : "First select a department"} />
              </SelectTrigger>
              <SelectContent>
                {selectedDepartment &&
                  programsByDepartment[selectedDepartment]?.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Selection */}
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Year of Study
            </Label>
            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!selectedProgram}>
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder={selectedProgram ? "Select your year" : "First select a program"} />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Selection Summary */}
          {(selectedDepartment || selectedProgram || selectedYear) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Your Selection:</h4>
              <div className="space-y-1 text-sm text-blue-800">
                {selectedDepartment && (
                  <div>Department: {departments.find((d) => d.id === selectedDepartment)?.name}</div>
                )}
                {selectedProgram && (
                  <div>
                    Program: {programsByDepartment[selectedDepartment]?.find((p) => p.id === selectedProgram)?.name}
                  </div>
                )}
                {selectedYear && <div>Year: {years.find((y) => y.id === selectedYear)?.name}</div>}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            {isFormComplete ? "View My Timetable" : "Complete Selection to Continue"}
          </Button>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact the Academic Office at academic@bugema.ac.ug</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
