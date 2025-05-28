"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, GraduationCap } from "lucide-react"
import Image from "next/image"

export function LecturerLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    // In real app, this would authenticate and redirect to lecturer dashboard
    console.log("Login attempt:", { email, password })
    // For demo, redirect to lecturer dashboard
    window.location.href = "/lecturers/dashboard"
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-xl border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
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
            <GraduationCap className="w-6 h-6" />
            Lecturer Portal
          </CardTitle>
          <p className="text-blue-100 mt-2">Access your teaching schedule and manage classes</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Staff Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="lecturer@bugema.ac.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
              Sign In to Portal
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Need help accessing your account?</p>
              <p>Contact IT Support: it@bugema.ac.ug</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
