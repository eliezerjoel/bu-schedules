import { Navbar } from "../../components/navbar"
import { AdminLogin } from "../../components/admin-login"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <AdminLogin />
    </div>
  )
}
