import { Navbar } from "../../../components/navbar"
import { LecturerDashboard } from "../../../components/lecturer-dashboard"

export default function LecturerDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <LecturerDashboard />
    </div>
  )
}
