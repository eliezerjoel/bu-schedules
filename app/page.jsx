import { Navbar } from "../components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">General University Timetable</h1>
          <p className="text-gray-600">View the complete schedule for all courses and programs at Bugema University</p>
        </div>

        {/* Placeholder for general timetable */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium mb-2">General Timetable</h3>
            <p>The complete university timetable will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
