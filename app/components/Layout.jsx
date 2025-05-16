'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, User, Settings, Calendar, BookOpen, Users, MoreHorizontal } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button 
                onClick={toggleSidebar}
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-indigo-600">Bugema University</span>
              </div>
              <nav className="hidden md:flex space-x-8 ml-6 items-center">
                <Link href="/dashboard" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/courses/all" className="text-indigo-600 border-b-2 border-indigo-500 px-3 py-2 text-sm font-medium">
                  Courses
                </Link>
                <Link href="/schedules" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Schedules
                </Link>
                <Link href="/rooms" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Classrooms
                </Link>
                <Link href="/instructors/all" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Faculty
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="relative">
                  <button className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600">
                      <User className="h-5 w-5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 flex z-40 md:hidden`} role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={toggleSidebar}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-indigo-600">Bugema University</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                <Link href="/dashboard" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <Calendar className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                  Dashboard
                </Link>
                <Link href="/courses" className="bg-indigo-50 text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <BookOpen className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-500" />
                  Courses
                </Link>
                <Link href="/schedules" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <Calendar className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                  Schedules
                </Link>
                <Link href="/rooms" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <BookOpen className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                  Classrooms
                </Link>
                <Link href="/instructors/all" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <Users className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                  Faculty
                </Link>
                <Link href="/settings" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <Settings className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700">Admin User</p>
                  <p className="text-sm font-medium text-gray-500">admin@bugema.ac.ug</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  <Link href="/dashboard" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <Calendar className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                    Dashboard
                  </Link>
                  <Link href="/courses" className="bg-indigo-50 text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <BookOpen className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-500" />
                    Courses
                  </Link>
                  <Link href="/schedules" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <Calendar className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                    Schedules
                  </Link>
                  <Link href="/rooms" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <BookOpen className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                    Classrooms
                  </Link>
                  <Link href="/instructors/all" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <Users className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                    Faculty
                  </Link>
                  <Link href="/settings" className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <Settings className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                    Settings
                  </Link>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs font-medium text-gray-500">admin@bugema.ac.ug</p>
                  </div>
                  <button className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-8">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Bugema University. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}