import { StudentSelectionForm } from "../../../components/student-selection-form"

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Timetable</h1>
          <p className="text-gray-600">Select your department, program, and year to view your course timetable</p>
        </div>

        <StudentSelectionForm />
      </div>
    </div>
  )
}
