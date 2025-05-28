import { AdminNavbar } from "../../components/admin-navbar"

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  )
}
