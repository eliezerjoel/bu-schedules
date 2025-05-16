// // app/courses/[id]/page.js
 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';

// export default function CourseDetail() {
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/courses/${id}`); // Adjust URL if needed
//         if (!response.ok) {
//           if (response.status === 404) {
//             setError('Course not found.');
//           } else {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           setLoading(false);
//           return;
//         }
//         const data = await response.json();
//         setCourse(data);
//         setLoading(false);
//       } catch (e) {
//         setError(e);
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id]);

//   if (loading) {
//     return <p>Loading course details...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   if (!course) {
//     return <p>No course details found.</p>;
//   }

//   return (
//     <div>
//       <h1>{course.courseName}</h1>
//       <p>Course Code: {course.courseCode}</p>
//       <p>Credits: {course.credits}</p>
//       <Link href="/courses/all">Back to All Courses</Link>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Clock, Users, BookOpen, Calendar, User, ChevronRight } from 'lucide-react';

export default function CourseDetailsPage() {
  // In a real application, you would fetch this data from your API
  // based on the course ID from the route parameters
  const [course, setCourse] = useState({
    id: 1,
    code: 'COMP101',
    name: 'Introduction to Computing',
    department: 'Computer Science',
    credits: 3,
    semester: 'Fall 2025',
    description: 'This course provides an introduction to computer science and programming. Topics include algorithm development, data types, program control structures, functions, objects, and basic software engineering principles.',
    lecturer: 'Dr. Jane Smith',
    prerequisites: ['None'],
    sessions: [
      { id: 1, day: 'Monday', startTime: '10:00 AM', endTime: '11:30 AM', room: 'CS Lab 101' },
      { id: 2, day: 'Wednesday', startTime: '10:00 AM', endTime: '11:30 AM', room: 'CS Lab 101' },
    ],
    enrolledStudents: 42,
    maxCapacity: 50
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading (in real app, this would be an API call)
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading course details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <a href="/courses/all" className="mr-3 text-indigo-600 hover:text-indigo-900">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{course.code}: {course.name}</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {course.department} • {course.credits} Credits • {course.semester}
                  </p>
                </div>
                <div>
                  <a href={`/courses/${course.id}/edit`} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Course Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the course curriculum and schedule</p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{course.description}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Prerequisites</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {course.prerequisites.join(', ')}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Lecturer</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{course.lecturer}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Course Schedule</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Times and locations for class sessions</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    {course.sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 rounded-full p-2 mr-3">
                              <Calendar className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-medium">{session.day}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> {session.startTime} - {session.endTime}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{session.room}</div>
                            <div className="text-sm text-gray-500">Room</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Related */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Stats</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-500">Enrollment</div>
                        <div className="mt-1 text-lg font-semibold">
                          {course.enrolledStudents} / {course.maxCapacity}
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(course.enrolledStudents / course.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-500">Credits</div>
                        <div className="mt-1 text-lg font-semibold">{course.credits}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Related Courses</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <a href="/courses/2" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-600 truncate">COMP201: Data Structures</p>
                          <p className="text-sm text-gray-500">Computer Science • 3 Credits</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="/courses/3" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-600 truncate">COMP205: Programming Fundamentals</p>
                          <p className="text-sm text-gray-500">Computer Science • 4 Credits</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="/courses/4" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-600 truncate">MATH101: College Algebra</p>
                          <p className="text-sm text-gray-500">Mathematics • 3 Credits</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}