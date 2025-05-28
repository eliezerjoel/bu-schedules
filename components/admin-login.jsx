"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, User } from "lucide-react"
import Image from "next/image"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    // In real app, this would authenticate and redirect to admin dashboard
    console.log("Admin login attempt:", { email, password })
    // For demo, redirect to admin dashboard
    window.location.href = "/admin/dashboard"
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-xl border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
          <div className="mb-4">
            <Image
              src="/bugema-logo.png"
              alt="Bugema University Logo"
              width={60}
              height={60}
              className="mx-auto brightness-0 invert"
            />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Shield className="w-6 h-6" />
            Admin Portal
          </CardTitle>
          <p className="text-red-100 mt-2">System Administration & Management</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bugema.ac.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-600" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-red-600 hover:text-red-800 underline-offset-2 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium">
              Access Admin Panel
            </Button>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 text-sm">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Restricted Access</span>
              </div>
              <p className="text-red-700 text-sm mt-1">
                This portal is for authorized administrators only. All access is logged and monitored.
              </p>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Technical issues? Contact:</p>
              <p>System Admin: sysadmin@bugema.ac.ug</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
