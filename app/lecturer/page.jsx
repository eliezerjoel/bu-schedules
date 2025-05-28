import { Navbar } from "../../components/navbar"
import { LecturerLogin } from "../../components/lecturer-login"

export default function LecturersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <LecturerLogin />
    </div>
  )
}
