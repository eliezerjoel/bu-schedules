"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { GraduationCap, LogOut, Home, Calendar, BookOpen, Users } from "lucide-react"

export function LecturerNavbar() {
  const handleSignOut = () => {
    // In real app, this would clear session and redirect
    window.location.href = "/"
  }

  return (
    <nav className="bg-white border-b-2 border-green-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Lecturer Branding */}
          <div className="flex items-center space-x-8">
            <Link href="/lecturers/dashboard" className="flex items-center space-x-3">
              <Image
                src="/bugema-logo.png"
                alt="Bugema University Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Bugema University</span>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Lecturer Portal
                </div>
              </div>
            </Link>

            <Link
              href="/lecturers/dashboard"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Lecturer Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/lecturers/dashboard">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                My Schedule
              </Button>
            </Link>

            <Link href="/lecturers/courses">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                My Courses
              </Button>
            </Link>

            <Link href="/lecturers/students">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Students
              </Button>
            </Link>

            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2">
                <Home className="w-4 h-4 mr-2" />
                Public View
              </Button>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="flex items-center">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
