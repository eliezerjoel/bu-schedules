import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseAssignment from './CourseAssignment';

const TimetableAdmin = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'view'
  const [filterDay, setFilterDay] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterLecturer, setFilterLecturer] = useState('');
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    // Fetch existing assignments
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('/api/timetable/assignments');
        setAssignments(response.data);
      } catch (err) {
        setError('Failed to load assignments');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch courses for filtering
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/timetable/courses');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    // Fetch lecturers for filtering
    const fetchLecturers = async () => {
      try {
        const response = await axios.get('/api/timetable/lecturers');
        setLecturers(response.data);
      } catch (err) {
        console.error('Error fetching lecturers:', err);
      }
    };

    fetchAssignments();
    fetchCourses();
    fetchLecturers();
  }, []);

  // Refresh assignments after a new one is created
  const refreshAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/timetable/assignments');
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to refresh assignments');
      console.error('Error refreshing assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle assignment deletion
  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await axios.delete(`/api/timetable/assignments/${assignmentId}`);
      // Remove the deleted assignment from the state
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (err) {
      setError('Failed to delete assignment');
      console.error('Error deleting assignment:', err);
    }
  };

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter(assignment => {
    // Apply day filter
    if (filterDay && assignment.dayOfWeek !== filterDay) {
      return false;
    }
    
    // Apply course filter
    if (filterCourse && assignment.course.id.toString() !== filterCourse) {
      return false;
    }
    
    // Apply lecturer filter
    if (filterLecturer && assignment.lecturer.id.toString() !== filterLecturer) {
      return false;
    }
    
    return true;
  });

  // Sort assignments by day and time
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    // First sort by day of week
    const dayOrder = { 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5 };
    const dayDiff = dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
    if (dayDiff !== 0) return dayDiff;
    
    // Then sort by start time
    return a.startTime.localeCompare(b.startTime);
  });

  if (loading && activeTab === 'view') {
    return <div className="flex justify-center p-8">Loading timetable data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Course Timetable Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'create' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Assignments
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'view' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('view');
            refreshAssignments();
          }}
        >
          View Timetable
        </button>
      </div>
      
      {/* Create Assignment Tab */}
      {activeTab === 'create' && (
        <CourseAssignment onAssignmentCreated={refreshAssignments} />
      )}
      
      {/* View Timetable Tab */}
      {activeTab === 'view' && (
        <div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* Filters */}
          <div className="bg-gray-50 p-4 rounded mb-6">
            <h2 className="text-lg font-medium mb-3">Filter Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                >
                  <option value="">All Days</option>
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lecturer</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  value={filterLecturer}
                  onChange={(e) => setFilterLecturer(e.target.value)}
                >
                  <option value="">All Lecturers</option>
                  {lecturers.map(lecturer => (
                    <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                setFilterDay('');
                setFilterCourse('');
                setFilterLecturer('');
              }}
            >
              Clear Filters
            </button>
          </div>
          
          {/* Timetable Display */}
          {sortedAssignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 border text-left">Day</th>
                    <th className="py-3 px-4 border text-left">Time</th>
                    <th className="py-3 px-4 border text-left">Course</th>
                    <th className="py-3 px-4 border text-left">Lecturer</th>
                    <th className="py-3 px-4 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border">{assignment.dayOfWeek}</td>
                      <td className="py-3 px-4 border">{`${assignment.startTime} - ${assignment.endTime}`}</td>
                      <td className="py-3 px-4 border">
                        <div className="font-medium">{assignment.course.name}</div>
                        <div className="text-sm text-gray-600">{assignment.course.code}</div>
                      </td>
                      <td className="py-3 px-4 border">{assignment.lecturer.name}</td>
                      <td className="py-3 px-4 border text-center">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded">
              <p className="text-gray-600">
                {assignments.length === 0 
                  ? "No assignments have been created yet." 
                  : "No assignments match your filter criteria."
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimetableAdmin;