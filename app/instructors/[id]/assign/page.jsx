
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssignClassesToLecturer() {
  const { lecturerId } = useParams();
  const [lecturer, setLecturer] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Mock student groups for demonstration
  const studentGroups = [
    { id: "sg1", name: "Group A - First Year" },
    { id: "sg2", name: "Group B - Second Year" },
    { id: "sg3", name: "Group C - Third Year" },
    { id: "sg4", name: "Group D - Fourth Year" }
  ];

  // Days of week options
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ];

  useEffect(() => {
    const fetchLecturerAndCourses = async () => {
      try {
        setLoading(true);
        const lecturerResponse = await fetch(`http://localhost:8080/api/instructors/${lecturerId}`);
        if (!lecturerResponse.ok) {
          throw new Error(`Failed to fetch lecturer: ${lecturerResponse.status}`);
        }
        const lecturerData = await lecturerResponse.json();
        setLecturer(lecturerData);

        const coursesResponse = await fetch('http://localhost:8080/api/courses');
        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLecturerAndCourses();
  }, [lecturerId]);

  const handleAssignCourse = (courseId) => {
    const courseToAdd = courses.find(course => course.id === courseId);
    if (courseToAdd && !assignedCourses.some(item => item.course.id === courseId)) {
      setAssignedCourses([...assignedCourses, { 
        course: courseToAdd, 
        dayOfWeek: '', 
        startTime: '', 
        endTime: '', 
        studentGroup: '' 
      }]);
    }
  };

  const handleRemoveAssignedCourse = (courseId) => {
    setAssignedCourses(assignedCourses.filter(item => item.course.id !== courseId));
  };

  const handleTimeChange = (index, field, value) => {
    const updatedAssignedCourses = [...assignedCourses];
    updatedAssignedCourses[index][field] = value;
    setAssignedCourses(updatedAssignedCourses);
  };

  const handleStudentGroupChange = (index, studentGroupId) => {
    const updatedAssignedCourses = [...assignedCourses];
    updatedAssignedCourses[index].studentGroup = studentGroupId;
    setAssignedCourses(updatedAssignedCourses);
  };

  const handleSubmitSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = assignedCourses.map(item => ({
        instructor: lecturer.id,
        course: item.course.id,
        studentGroup: item.studentGroup,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        semester: 'Fall 2025',
        academicYear: '2025-2026',
      }));

      const response = await fetch('http://localhost:8080/api/scheduled-classes/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save schedule: ${response.status} - ${errorData?.message || response.statusText}`);
      }

      router.push('/schedule/all');
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg mx-auto my-8 max-w-4xl">
        <h1 className="text-red-600 text-xl font-bold mb-2">Error</h1>
        <p className="text-red-600">{error}</p>
        <Link href="/schedule/assign-lecturer" className="mt-4 inline-block text-purple-700 hover:text-purple-900">
          Return to Lecturer Selection
        </Link>
      </div>
    );
  }

  if (!lecturer) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg mx-auto my-8 max-w-4xl">
        <h1 className="text-yellow-600 text-xl font-bold mb-2">Lecturer Not Found</h1>
        <p className="text-yellow-600">The requested lecturer could not be found.</p>
        <Link href="/schedule/assign-lecturer" className="mt-4 inline-block text-purple-700 hover:text-purple-900">
          Return to Lecturer Selection
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Assign Classes to {lecturer.firstName} {lecturer.lastName}
        </h1>
        <p className="text-gray-600">Manage course assignments for Bugema University</p>
      </div>

      {/* Available Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Available Courses</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Hours</th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap">{course.courseCode}</td>
                    <td className="py-3 px-4">{course.courseName}</td>
                    <td className="py-3 px-4">{course.department}</td>
                    <td className="py-3 px-4">{course.creditHours}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleAssignCourse(course.id)}
                        disabled={assignedCourses.some(item => item.course.id === course.id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          assignedCourses.some(item => item.course.id === course.id)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {assignedCourses.some(item => item.course.id === course.id) ? 'Assigned' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                    No courses found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assigned Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Assigned Courses and Schedule</h2>
        
        {assignedCourses.length > 0 ? (
          <div className="space-y-6">
            {assignedCourses.map((assignedCourse, index) => (
              <div key={assignedCourse.course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4">
                  <div className="w-full md:w-auto mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-800">
                      {assignedCourse.course.courseCode} - {assignedCourse.course.courseName}
                    </h3>
                    <p className="text-sm text-gray-500">{assignedCourse.course.department} • {assignedCourse.course.creditHours} credit hours</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAssignedCourse(assignedCourse.course.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                    <select
                      value={assignedCourse.dayOfWeek}
                      onChange={(e) => handleTimeChange(index, 'dayOfWeek', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={assignedCourse.startTime}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={assignedCourse.endTime}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Group</label>
                    <select
                      value={assignedCourse.studentGroup}
                      onChange={(e) => handleStudentGroupChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Group</option>
                      {studentGroups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p className="text-gray-600 text-lg mb-2">No courses assigned yet</p>
            <p className="text-gray-500 text-sm">Use the table above to assign courses to this lecturer</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Link 
          href="/schedule/assign-lecturer" 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Lecturer Selection
        </Link>
        
        <button
          onClick={handleSubmitSchedule}
          disabled={assignedCourses.length === 0 || loading}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            assignedCourses.length === 0 || loading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Saving...
            </>
          ) : (
            'Save Schedule'
          )}
        </button>
      </div>
    </div>
  );
}