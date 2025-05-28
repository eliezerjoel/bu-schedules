import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="bg-white border-b-2 border-blue-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Home */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/bugema-logo.png"
                alt="Bugema University Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Bugema University</span>
                <div className="text-xs text-blue-600 font-medium">Timetable System</div>
              </div>
            </Link>

            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/lecturers">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2">
                For Lecturers
              </Button>
            </Link>

            <Link href="/students">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2">
                For Students
              </Button>
            </Link>
          </div>

          {/* Admin Login */}
          <div className="flex items-center">
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                Admin Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div className="flex flex-col space-y-2">
            <Link href="/lecturers">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                For Lecturers
              </Button>
            </Link>

            <Link href="/students">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                For Students
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
