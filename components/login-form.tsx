import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-blue-200 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 bg-white">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Image
                    src="/bugema-logo.png"
                    alt="Bugema University Logo"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-balance text-gray-600">Login to your Bugema University portal</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@bugema.ac.ug"
                  required
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Login to Portal
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
                <span className="relative z-10 bg-white px-2 text-gray-500">Or continue with</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-2">Google</span>
                </Button>
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </Button>
              </div>
              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-4">
                  Apply for admission
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-gradient-to-br from-blue-600 to-blue-800 md:block">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex h-full flex-col justify-center p-8 text-white">
              <div className="mb-8">
                <Image
                  src="/bugema-logo.png"
                  alt="Bugema University Logo"
                  width={120}
                  height={120}
                  className="mx-auto mb-6 brightness-0 invert"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">Excellence in Service</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Since 1948, Bugema University has been committed to providing quality education and fostering academic
                excellence in a Christian environment.
              </p>
              <div className="mt-8 space-y-2">
                <div className="flex items-center text-blue-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Quality Education</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Christian Values</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Global Community</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-600">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-600">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}
