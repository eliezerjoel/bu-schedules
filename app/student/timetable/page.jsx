import { Navbar } from "../../../components/navbar"
import { StudentTimetable } from "../../../components/student-timetable"

export default function StudentTimetablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <StudentTimetable />
    </div>
  )
}
