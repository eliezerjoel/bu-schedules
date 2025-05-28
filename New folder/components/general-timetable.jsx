"use client"

import React, { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

export default function GeneralTimetable() {
  const [timetableData, setTimetableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchScheduledClasses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/scheduled-classes")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched scheduled classes:", data)
        
        // Transform the flat data into the structured format required by the component
        const transformedData = transformScheduledClasses(data)
        setTimetableData(transformedData)
      } catch (e) {
        setError("Failed to fetch scheduled classes: " + e.message)
        console.error("Fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchScheduledClasses()
  }, [])

  // Function to transform flat scheduled classes data into the desired structure
  const transformScheduledClasses = (scheduledClasses) => {
    console.log("Before transformation:", scheduledClasses)
    const departmentsMap = new Map()

    scheduledClasses.forEach((schClass) => {
      // CORRECTED LINE HERE: Access department from instructor object
      const departmentName = schClass.instructor.department; 
      const day = schClass.dayOfWeek;
      const timeSlot = `${schClass.startTime.substring(0, 5)}-${schClass.endTime.substring(0, 5)}`; // Format time

      if (!departmentsMap.has(departmentName)) {
        departmentsMap.set(departmentName, {
          department: departmentName,
          schedule: {},
        });
      }

      const departmentEntry = departmentsMap.get(departmentName);

      if (!departmentEntry.schedule[day]) {
        departmentEntry.schedule[day] = {};
      }

      if (!departmentEntry.schedule[day][timeSlot]) {
        departmentEntry.schedule[day][timeSlot] = [];
      }

      departmentEntry.schedule[day][timeSlot].push({
        code: schClass.course.courseCode,
        name: schClass.course.courseName,
        lecturer: `${schClass.instructor.firstName} ${schClass.instructor.lastName}`,
      });
    });

    return Array.from(departmentsMap.values());
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-700">Loading timetable...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p className="text-lg">Error: {error}</p>
      </div>
    )
  }

  if (timetableData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-700">No scheduled classes found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bugema University Timetable</h1>
        <p className="text-gray-600">Weekly Schedule by Department</p>
      </div>

      {timetableData.map((departmentData, deptIndex) => (
        <Card key={deptIndex} className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-xl font-bold text-center">{departmentData.department}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700 min-w-[200px]">COURSE CODE AND NAME</th>
                    <th className="text-left p-4 font-semibold text-gray-700 min-w-[150px]">LECTURER</th>
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day) => {
                    const daySchedule = departmentData.schedule[day]
                    if (!daySchedule || Object.keys(daySchedule).length === 0) {
                      return null
                    }

                    const timeSlots = Object.keys(daySchedule).sort()

                    return (
                      <React.Fragment key={day}>
                        {/* Day Header */}
                        <tr>
                          <td colSpan="2" className="bg-blue-50 p-3 border-b">
                            <h3 className="font-bold text-blue-800 text-center text-lg">{day}</h3>
                          </td>
                        </tr>

                        {/* Time Slots for this day */}
                        {timeSlots.map((timeSlot) => {
                          const courses = daySchedule[timeSlot]

                          return (
                            <React.Fragment key={`${day}-${timeSlot}`}>
                              {/* Time Slot Header */}
                              <tr>
                                <td colSpan="2" className="bg-gray-100 p-2 border-b">
                                  <div className="text-center">
                                    <Badge variant="outline" className="bg-white text-gray-700 font-medium">
                                      {timeSlot}
                                    </Badge>
                                  </div>
                                </td>
                              </tr>

                              {/* Courses in this time slot */}
                              {courses.map((course, courseIndex) => (
                                <tr key={courseIndex} className="border-b hover:bg-gray-50 transition-colors">
                                  <td className="p-4">
                                    <div className="space-y-1">
                                      <div className="font-semibold text-blue-700">{course.code}</div>
                                      <div className="text-gray-800">{course.name}</div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="text-gray-700 font-medium">{course.lecturer}</div>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          )
                        })}

                        {/* Spacer row between days */}
                        <tr>
                          <td colSpan="2" className="p-2"></td>
                        </tr>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}