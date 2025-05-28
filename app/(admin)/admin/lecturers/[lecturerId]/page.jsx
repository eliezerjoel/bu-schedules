import { AdminLecturerSchedule } from "../../../../../components/admin-lecturer-schedule"

export default function AdminLecturerDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminLecturerSchedule lecturerId={params.lecturerId} />
    </div>
  )
}
