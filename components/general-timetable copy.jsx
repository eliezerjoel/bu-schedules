"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data structure - you can replace this with your actual data
const sampleTimetableData = [
  {
    department: "DEPARTMENT OF COMPUTING AND INFORMATICS",
    schedule: {
      MONDAY: {
        "08:00-09:00": [{ code: "BSCR 1201", name: "Database Fundamentals", lecturer: "Hudson Nandere" }],
        "08:00-09:00": [{ code: "BSCR 1201", name: "Database Fundamentals 2", lecturer: "Erma Ssewankambo" }],
        "09:00-10:00": [{ code: "BSCR 1211", name: "Fundamentals of AI", lecturer: "Hudson Nandere" }],
        "10:00-11:00": [{ code: "BSCR 1301", name: "Web Development", lecturer: "Sarah Johnson" }],
        "11:00-12:00": [{ code: "BSCR 1401", name: "Data Structures", lecturer: "Michael Brown" }],
      },
      TUESDAY: {
        "08:00-09:00": [{ code: "BSCR 1501", name: "Software Engineering", lecturer: "Alice Cooper" }],
        "09:00-10:00": [{ code: "BSCR 1601", name: "Computer Networks", lecturer: "David Wilson" }],
      },
      WEDNESDAY: {
        "08:00-09:00": [{ code: "BSCR 1701", name: "Operating Systems", lecturer: "Emma Davis" }],
      },
      THURSDAY: {
        "09:00-10:00": [{ code: "BSCR 1801", name: "Mobile App Development", lecturer: "James Miller" }],
      },
      FRIDAY: {
        "08:00-09:00": [{ code: "BSCR 1901", name: "Cybersecurity Basics", lecturer: "Lisa Anderson" }],
      },
    },
  },
  {
    department: "DEPARTMENT OF ACCOUNTING AND FINANCE",
    schedule: {
      MONDAY: {
        "08:00-09:00": [{ code: "BSCR 1201", name: "Accounting Fundamentals", lecturer: "Hudson Nandere" }],
        "09:00-10:00": [
          { code: "BSCR 1211", name: "Fundamentals of Taxation", lecturer: "Hudson Nandere" },
          { code: "BSCR 1201", name: "Accounting Fundamentals II", lecturer: "Musisi Peter" },
        ],
      },
      TUESDAY: {
        "08:00-09:00": [{ code: "BSCR 2101", name: "Financial Management", lecturer: "Grace Nakato" }],
        "10:00-11:00": [{ code: "BSCR 2201", name: "Cost Accounting", lecturer: "Robert Ssali" }],
      },
      WEDNESDAY: {
        "09:00-10:00": [{ code: "BSCR 2301", name: "Auditing Principles", lecturer: "Mary Namukasa" }],
      },
      THURSDAY: {
        "08:00-09:00": [{ code: "BSCR 2401", name: "Business Law", lecturer: "John Mukasa" }],
      },
      FRIDAY: {
        "08:00-09:00": [{ code: "BSCR 2501", name: "Investment Analysis", lecturer: "Peter Kato" }],
        "09:00-10:00": [{ code: "BSCR 2601", name: "International Finance", lecturer: "Susan Nabirye" }],
      },
    },
  },
]

const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

export default function GeneralTimetable({ timetableData = sampleTimetableData }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null)

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
