"use client"
import { useState, useEffect } from "react"
import React from "react"
import axios from "axios"

const AllSchedulesTable = () => {
  const [schedules, setSchedules] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Days of the week
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

  // Time slots for the schedule
  const timeSlots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all schedules
        const schedulesResponse = await axios.get("http://localhost:8080/api/scheduled-classes/all")

        // Fetch departments
        const departmentsResponse = await axios.get("http://localhost:8080/api/departments")

        console.log("Fetched schedules:", schedulesResponse.data)
        console.log("Fetched departments:", departmentsResponse.data)

        setSchedules(schedulesResponse.data)
        setDepartments(departmentsResponse.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load schedules")
        setLoading(false)
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  // Group schedules by department, day, and time
  const groupSchedules = () => {
    const grouped = {}

    // Initialize structure
    departments.forEach((dept) => {
      grouped[dept.id] = {
        department: dept,
        days: {},
      }

      daysOfWeek.forEach((day) => {
        grouped[dept.id].days[day] = {}
        timeSlots.forEach((timeSlot) => {
          grouped[dept.id].days[day][timeSlot] = []
        })
      })
    })

    // Group schedules
    schedules.forEach((schedule) => {
      const deptId = schedule.department?.id
      const day = schedule.dayOfWeek?.toUpperCase()

      if (!deptId || !day) return

      // Create time slot key from start and end time
      const startTime = schedule.startTime?.substring(0, 5) // "HH:MM"
      const endTime = schedule.endTime?.substring(0, 5) // "HH:MM"
      const timeKey = `${startTime}-${endTime}`

      if (grouped[deptId] && grouped[deptId].days[day] && grouped[deptId].days[day][timeKey]) {
        grouped[deptId].days[day][timeKey].push(schedule)
      }
    })

    return grouped
  }

  const groupedSchedules = groupSchedules()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading all schedules...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Class Schedules</h1>
        <p className="text-gray-600">Complete schedule overview for all departments</p>
      </div>

      {/* Main Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-bold">COURSE CODE AND NAME</th>
              <th className="border border-gray-300 p-3 text-left font-bold">LECTURER</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => {
              const deptSchedules = groupedSchedules[department.id]

              return (
                <React.Fragment key={department.id}>
                  {/* Department Header */}
                  <tr>
                    <td colSpan="2" className="border border-gray-300 p-3 bg-gray-200 font-bold text-center text-lg">
                      {department.name?.toUpperCase() || "UNKNOWN DEPARTMENT"}
                    </td>
                  </tr>

                  {/* Days for this department */}
                  {daysOfWeek.map((day) => {
                    const daySchedules = deptSchedules?.days[day] || {}

                    return (
                      <React.Fragment key={`${department.id}-${day}`}>
                        {/* Day Header */}
                        <tr>
                          <td colSpan="2" className="border border-gray-300 p-2 bg-gray-50 font-semibold text-center">
                            {day}
                          </td>
                        </tr>

                        {/* Time periods for this day */}
                        {timeSlots.map((timeSlot) => {
                          const classes = daySchedules[timeSlot] || []

                          return (
                            <React.Fragment key={`${department.id}-${day}-${timeSlot}`}>
                              {/* Time Period Header */}
                              <tr>
                                <td
                                  colSpan="2"
                                  className="border border-gray-300 p-2 bg-blue-50 font-medium text-center"
                                >
                                  {timeSlot}
                                </td>
                              </tr>

                              {/* Classes for this time period */}
                              {classes.length > 0 ? (
                                classes.map((schedule, index) => (
                                  <tr key={`${department.id}-${day}-${timeSlot}-${index}`}>
                                    <td className="border border-gray-300 p-3">
                                      <div className="font-medium">
                                        {schedule.course?.courseCode} {schedule.course?.courseName}
                                      </div>
                                      {schedule.studentGroup && (
                                        <div className="text-sm text-gray-600 mt-1">
                                          Group: {schedule.studentGroup?.name || schedule.studentGroup}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                      {schedule.instructor?.name || "TBA"}
                                      {schedule.room && (
                                        <div className="text-sm text-gray-600 mt-1">Room: {schedule.room}</div>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                // Show empty row if no classes
                                <tr>
                                  <td className="border border-gray-300 p-3 text-gray-400 italic">
                                    No classes scheduled
                                  </td>
                                  <td className="border border-gray-300 p-3 text-gray-400">...</td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}

                  {/* Spacing between departments */}
                  <tr>
                    <td colSpan="2" className="border-0 p-2"></td>
                  </tr>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-blue-800">Total Departments</h3>
          <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-green-800">Total Classes</h3>
          <p className="text-2xl font-bold text-green-600">{schedules.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-purple-800">Unique Instructors</h3>
          <p className="text-2xl font-bold text-purple-600">{new Set(schedules.map((s) => s.instructor?.id)).size}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-orange-800">Unique Courses</h3>
          <p className="text-2xl font-bold text-orange-600">{new Set(schedules.map((s) => s.course?.id)).size}</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Schedule
        </button>
      </div>
    </div>
  )
}

export default AllSchedulesTable
