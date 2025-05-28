"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Shield, LogOut, Home, Settings, BarChart3 } from "lucide-react"

export function AdminNavbar() {
  const handleSignOut = () => {
    // In real app, this would clear session and redirect
    window.location.href = "/"
  }

  return (
    <nav className="bg-white border-b-2 border-red-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Admin Branding */}
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <Image
                src="/bugema-logo.png"
                alt="Bugema University Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Bugema University</span>
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin Portal
                </div>
              </div>
            </Link>

            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Admin Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/admin/reports">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </Link>

            <Link href="/admin/settings">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2">
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
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
