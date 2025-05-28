"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

export function PDFExportButton({ data, type, filename, children, ...props }) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPDF = async () => {
    setIsExporting(true)

    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default
      const html2canvas = (await import("html2canvas")).default

      const doc = new jsPDF("p", "mm", "a4")
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20

      // Add header
      doc.setFontSize(20)
      doc.setFont(undefined, "bold")
      doc.text("Bugema University", margin, 30)

      doc.setFontSize(12)
      doc.setFont(undefined, "normal")
      doc.text("Excellence in Service", margin, 40)

      // Add a line
      doc.setLineWidth(0.5)
      doc.line(margin, 45, pageWidth - margin, 45)

      let yPosition = 60

      if (type === "student-timetable") {
        // Student timetable export
        doc.setFontSize(16)
        doc.setFont(undefined, "bold")
        doc.text("Student Timetable", margin, yPosition)
        yPosition += 10

        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        doc.text(`Department: ${data.studentInfo.department}`, margin, yPosition)
        yPosition += 5
        doc.text(`Program: ${data.studentInfo.program} - ${data.studentInfo.year}`, margin, yPosition)
        yPosition += 5
        doc.text(`Semester: ${data.studentInfo.semester}`, margin, yPosition)
        yPosition += 15

        // Create timetable
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        days.forEach((day) => {
          const dayClasses = data.timetableData.filter((item) => item.day === day)

          if (dayClasses.length > 0) {
            doc.setFontSize(12)
            doc.setFont(undefined, "bold")
            doc.text(day, margin, yPosition)
            yPosition += 8

            dayClasses
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .forEach((classItem) => {
                doc.setFontSize(9)
                doc.setFont(undefined, "normal")

                const timeText = `${formatTime(classItem.startTime)} - ${formatTime(classItem.endTime)}`
                const courseText = `${classItem.courseCode}: ${classItem.courseName}`
                const lecturerText = `Lecturer: ${classItem.lecturer}`
                const typeText = `Type: ${classItem.type} (${classItem.credits} credits)`

                doc.text(`• ${timeText}`, margin + 5, yPosition)
                yPosition += 4
                doc.text(`  ${courseText}`, margin + 5, yPosition)
                yPosition += 4
                doc.text(`  ${lecturerText}`, margin + 5, yPosition)
                yPosition += 4
                doc.text(`  ${typeText}`, margin + 5, yPosition)
                yPosition += 8

                // Check if we need a new page
                if (yPosition > pageHeight - 30) {
                  doc.addPage()
                  yPosition = 30
                }
              })
            yPosition += 5
          }
        })

        // Add summary
        if (yPosition > pageHeight - 50) {
          doc.addPage()
          yPosition = 30
        }

        yPosition += 10
        doc.setFontSize(12)
        doc.setFont(undefined, "bold")
        doc.text("Semester Summary", margin, yPosition)
        yPosition += 10

        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        const totalCourses = new Set(data.timetableData.map((item) => item.courseCode)).size
        const totalCredits = data.timetableData.reduce((sum, course) => {
          const uniqueCourses = new Set()
          data.timetableData.forEach((item) => uniqueCourses.add(item.courseCode))
          return Array.from(uniqueCourses).reduce((total, code) => {
            const course = data.timetableData.find((item) => item.courseCode === code)
            return total + course.credits
          }, 0)
        }, 0)

        doc.text(`Total Courses: ${totalCourses}`, margin, yPosition)
        yPosition += 5
        doc.text(`Total Credits: ${totalCredits}`, margin, yPosition)
        yPosition += 5
        doc.text(`Weekly Classes: ${data.timetableData.length}`, margin, yPosition)
      } else if (type === "lecturer-schedule") {
        // Lecturer schedule export
        doc.setFontSize(16)
        doc.setFont(undefined, "bold")
        doc.text("Lecturer Teaching Schedule", margin, yPosition)
        yPosition += 10

        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        doc.text(`Name: ${data.lecturerInfo.name}`, margin, yPosition)
        yPosition += 5
        doc.text(`Department: ${data.lecturerInfo.department}`, margin, yPosition)
        yPosition += 5
        doc.text(`Employee ID: ${data.lecturerInfo.employeeId}`, margin, yPosition)
        yPosition += 5
        doc.text(`Semester: ${data.lecturerInfo.semester}`, margin, yPosition)
        yPosition += 15

        // Create schedule
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        days.forEach((day) => {
          const dayClasses = data.lecturerClasses.filter((item) => item.day === day)

          if (dayClasses.length > 0) {
            doc.setFontSize(12)
            doc.setFont(undefined, "bold")
            doc.text(day, margin, yPosition)
            yPosition += 8

            dayClasses
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .forEach((classItem) => {
                doc.setFontSize(9)
                doc.setFont(undefined, "normal")

                const timeText = `${formatTime(classItem.startTime)} - ${formatTime(classItem.endTime)}`
                const courseText = `${classItem.courseCode}: ${classItem.courseName}`
                const programText = `Program: ${classItem.program} - ${classItem.year}`
                const studentsText = `Students: ${classItem.students} | Type: ${classItem.type}`

                doc.text(`• ${timeText}`, margin + 5, yPosition)
                yPosition += 4
                doc.text(`  ${courseText}`, margin + 5, yPosition)
                yPosition += 4
                doc.text(`  ${programText}`, margin + 5, yPosition)
                yPosition += 4
                doc.text(`  ${studentsText}`, margin + 5, yPosition)
                yPosition += 8

                // Check if we need a new page
                if (yPosition > pageHeight - 30) {
                  doc.addPage()
                  yPosition = 30
                }
              })
            yPosition += 5
          }
        })

        // Add summary
        if (yPosition > pageHeight - 50) {
          doc.addPage()
          yPosition = 30
        }

        yPosition += 10
        doc.setFontSize(12)
        doc.setFont(undefined, "bold")
        doc.text("Teaching Summary", margin, yPosition)
        yPosition += 10

        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        const totalCourses = new Set(data.lecturerClasses.map((item) => item.courseCode)).size
        const totalStudents = data.lecturerClasses.reduce((sum, cls) => {
          const uniqueCourses = new Set()
          data.lecturerClasses.forEach((item) => uniqueCourses.add(item.courseCode))
          return Array.from(uniqueCourses).reduce((total, code) => {
            const course = data.lecturerClasses.find((item) => item.courseCode === code)
            return total + course.students
          }, 0)
        }, 0)

        doc.text(`Total Courses: ${totalCourses}`, margin, yPosition)
        yPosition += 5
        doc.text(`Total Students: ${totalStudents}`, margin, yPosition)
        yPosition += 5
        doc.text(`Weekly Classes: ${data.lecturerClasses.length}`, margin, yPosition)
      }

      // Add footer
      const now = new Date()
      const footerText = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`
      doc.setFontSize(8)
      doc.setFont(undefined, "italic")
      doc.text(footerText, margin, pageHeight - 10)

      // Save the PDF
      doc.save(filename || "timetable.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Button onClick={exportToPDF} disabled={isExporting} {...props}>
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? "Generating PDF..." : children || "Export PDF"}
    </Button>
  )
}
