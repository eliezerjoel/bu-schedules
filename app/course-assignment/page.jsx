'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseAssignment = () => {
  // State for each step of the workflow
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Enhanced state
  const [filters, setFilters] = useState({
    department: '',
    creditHours: '',
    searchTerm: ''
  });
  const [lecturerWorkloads, setLecturerWorkloads] = useState({});
  const [conflictMap, setConflictMap] = useState({});
  const [navigationStack, setNavigationStack] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch available lecturers when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchLecturers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/instructors?courseId=${selectedCourse.id}`
          );
          setLecturers(response.data);
          
          // Fetch workloads for each lecturer
          const workloads = {};
          await Promise.all(response.data.map(async lecturer => {
            const res = await axios.get(`http://localhost:8080/api/instructors/${lecturer.id}/workload`);
            workloads[lecturer.id] = res.data.totalHours;
          }));
          setLecturerWorkloads(workloads);
          
          setCurrentStep(2);
        } catch (err) {
          setError('Failed to load lecturers. Please try again.');
          console.error('Error fetching lecturers:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchLecturers();
    }
  }, [selectedCourse]);
  
  // Fetch available time slots and check conflicts
  useEffect(() => {
    if (selectedCourse && selectedLecturer) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Get available time slots
          const slotsResponse = await axios.get(
            `http://localhost:8080/api/timeslots/available?courseId=${selectedCourse.id}&instructorId=${selectedLecturer.id}`
          );
          setTimeSlots(slotsResponse.data);
          
          // Check conflicts for each slot - FIXED: Using the corrected checkConflicts function
          const conflicts = {};
          
          await Promise.all(slotsResponse.data.map(async slot => {
            try {
              const conflictData = {
                lecturerId: selectedLecturer.id,
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime
              };
              
              console.log('Checking conflict for slot:', slot);
              console.log('Conflict check data:', conflictData);
              
              const response = await axios.post(
                'http://localhost:8080/api/scheduled-classes/check-conflict', 
                conflictData
              );
              
              console.log("Response from server:", response.data);
              // FIXED: Store the hasConflict boolean value from the response
              conflicts[`${slot.dayOfWeek}-${slot.startTime}`] = response.data.hasConflict;
            } catch (err) {
              console.error('Error checking conflict for slot:', slot, err);
              // Default to assuming conflict if check fails
              conflicts[`${slot.dayOfWeek}-${slot.startTime}`] = true;
            }
          }));
          
          setConflictMap(conflicts);
          setCurrentStep(3);
        } catch (err) {
          setError('Failed to load time slots. Please try again.');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedLecturer, selectedCourse]);
  
  // Filter courses based on filters
  const filteredCourses = courses.filter(course => {
    return (
      (!filters.department || course.department === filters.department) &&
      (!filters.creditHours || course.credits == filters.creditHours) &&
      (!filters.searchTerm || 
       course.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    );
  });

  // Navigation functions
  const goToStep = (step, data) => {
    setNavigationStack([...navigationStack, { step: currentStep, data }]);
    setCurrentStep(step);
  };

  const goBack = () => {
    if (navigationStack.length > 0) {
      const previous = navigationStack[navigationStack.length - 1];
      setNavigationStack(navigationStack.slice(0, -1));
      setCurrentStep(previous.step);
      // Restore previous selections if needed
    } else {
      setCurrentStep(1);
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedLecturer(null);
    setSelectedTimeSlot(null);
    setSuccess(null);
    setError(null);
    goToStep(2, { course });
  };
  
  // Handle lecturer selection
  const handleLecturerSelect = (lecturer) => {
    setSelectedLecturer(lecturer);
    setSelectedTimeSlot(null);
    setSuccess(null);
    setError(null);
    goToStep(3, { lecturer });
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSuccess(null);
    setError(null);
  };
  
  // FIXED: Updated checkConflicts function based on the provided code
  const checkConflicts = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/scheduled-classes/check-conflict', {
        lecturerId: selectedLecturer.id,
        dayOfWeek: selectedTimeSlot.dayOfWeek,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime
      });
      
      console.log("Response from server:", response.data);
      return response.data.hasConflict; // Make sure this matches your backend response
    } catch (err) {
      console.error('Conflict check failed:', err);
      return true; // Assume conflict if check fails
    }
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    if (!selectedCourse || !selectedLecturer || !selectedTimeSlot) {
      setError('Please complete all selections before submitting.');
      return;
    }
    
    // FIXED: Use the updated checkConflicts function
    const hasConflict = await checkConflicts();
    if (hasConflict) {
      setError('This assignment conflicts with existing schedule. Please choose a different time.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/scheduled-classes/assign', {
        courseId: selectedCourse.id,
        instructorId: selectedLecturer.id,
        dayOfWeek: selectedTimeSlot.dayOfWeek,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        studentGroupId: "68143927369fa42e645e95cb"
      });
      
      setSuccess(`Successfully assigned ${selectedCourse.name} to ${selectedLecturer.name} on ${selectedTimeSlot.dayOfWeek} at ${selectedTimeSlot.startTime}`);
      
      // Reset for next assignment
      setSelectedCourse(null);
      setSelectedLecturer(null);
      setSelectedTimeSlot(null);
      setCurrentStep(1);
      setNavigationStack([]);
    } catch (err) {
      setError('Failed to create assignment. Please try again.');
      console.error('Error creating assignment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset the workflow
  const handleReset = () => {
    setSelectedCourse(null);
    setSelectedLecturer(null);
    setSelectedTimeSlot(null);
    setCurrentStep(1);
    setNavigationStack([]);
    setSuccess(null);
    setError(null);
  };
  
  // Render loading state
  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Timetable Assignment</h1>
      
      {/* Workflow Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>1</div>
          <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>2</div>
          <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>3</div>
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span>Select Course</span>
          <span>Assign Lecturer</span>
          <span>Choose Time</span>
        </div>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{success}</p>
        </div>
      )}
      
      {/* Step 1: Enhanced Course Selection */}
      {currentStep === 1 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Select a Course</h2>
          
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option value="">All Departments</option>
                <option value="CS">Computer Science</option>
                <option value="MA">Mathematics</option>
                {/* Add more departments */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Credits</label>
              <select 
                className="w-full p-2 border rounded"
                value={filters.creditHours}
                onChange={(e) => setFilters({...filters, creditHours: e.target.value})}
              >
                <option value="">All Credits</option>
                <option value="2">2 Credits</option>
                <option value="3">3 Credits</option>
                <option value="4">4 Credits</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Search courses..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
            </div>
          </div>
          
          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`border p-4 rounded cursor-pointer transition-all ${
                  selectedCourse?.id === course.id 
                    ? 'bg-blue-100 border-blue-500 scale-[1.02]' 
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handleCourseSelect(course)}
              >
                <h3 className="font-medium">{course.name}</h3>
                <p className="text-gray-600">{course.code}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">{course.credits} credits</span>
                  <span className="text-sm text-gray-500">{course.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Step 2: Enhanced Lecturer Assignment */}
      {currentStep === 2 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Step 2: Assign a Lecturer</h2>
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={goBack}
            >
              ← Back to Courses
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="font-medium">Selected Course: {selectedCourse?.name} ({selectedCourse?.code})</p>
            <p className="text-sm text-gray-600">{selectedCourse?.credits} credits | {selectedCourse?.department}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lecturers.length > 0 ? (
              lecturers.map((lecturer) => (
                <div
                  key={lecturer.id}
                  className={`border p-4 rounded cursor-pointer transition-all ${
                    selectedLecturer?.id === lecturer.id 
                      ? 'bg-blue-100 border-blue-500 scale-[1.02]' 
                      : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => handleLecturerSelect(lecturer)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{lecturer.lastName}, {lecturer.firstName}</h3>
                      <p className="text-gray-600">{lecturer.department}</p>
                    </div>
                    {lecturerWorkloads[lecturer.id] && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lecturerWorkloads[lecturer.id] > 15 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {lecturerWorkloads[lecturer.id]} hrs/wk
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{lecturer.qualifications}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full p-4 text-center bg-yellow-50 rounded">
                <p>No lecturers available for this course.</p>
                <button 
                  className="text-blue-500 mt-2"
                  onClick={handleReset}
                >
                  Select a different course
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Step 3: Enhanced Time Slot Selection */}
      {currentStep === 3 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Step 3: Choose Time Slot</h2>
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={goBack}
            >
              ← Back to Lecturers
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="font-medium">Selected Course: {selectedCourse?.name} ({selectedCourse?.code})</p>
            <p className="font-medium">Lecturer: {selectedLecturer?.lastName}, {selectedLecturer?.firstName}</p>
            {selectedLecturer && lecturerWorkloads[selectedLecturer.id] && (
              <p className="text-sm text-gray-600">
                Current workload: {lecturerWorkloads[selectedLecturer.id]} hours/week
              </p>
            )}
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 border font-medium">Day</th>
                  <th className="py-3 px-4 border font-medium">Time</th>
                  <th className="py-3 px-4 border font-medium">Status</th>
                  <th className="py-3 px-4 border font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot, index) => {
                    const slotKey = `${slot.dayOfWeek}-${slot.startTime}`;
                    // FIXED: Use the correct conflict value from the map
                    const hasConflict = conflictMap[slotKey] === true;
                    
                    return (
                      <tr 
                        key={index} 
                        className={selectedTimeSlot === slot 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                        }
                      >
                        <td className="py-3 px-4 border">{slot.dayOfWeek}</td>
                        <td className="py-3 px-4 border">{`${slot.startTime} - ${slot.endTime}`}</td>
                        <td className="py-3 px-4 border">
                          {hasConflict ? (
                            <span className="text-red-600 text-sm">Conflicted</span>
                          ) : (
                            <span className="text-green-600 text-sm">Available</span>
                          )}
                        </td>
                        <td className="py-3 px-4 border">
                          <button
                            className={`px-3 py-1 rounded text-sm ${
                              selectedTimeSlot === slot
                                ? 'bg-blue-500 text-white'
                                : hasConflict
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            onClick={() => !hasConflict && handleTimeSlotSelect(slot)}
                            disabled={hasConflict}
                          >
                            {selectedTimeSlot === slot ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center">
                      No available time slots for this combination. Please select a different lecturer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Assignment Preview */}
          {selectedTimeSlot && (
            <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium mb-3 text-lg">Assignment Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700"><span className="font-medium">Course:</span> {selectedCourse?.name}</p>
                  <p className="text-gray-700"><span className="font-medium">Code:</span> {selectedCourse?.code}</p>
                  <p className="text-gray-700"><span className="font-medium">Credits:</span> {selectedCourse?.credits}</p>
                </div>
                <div>
                  <p className="text-gray-700"><span className="font-medium">Lecturer:</span> {selectedLecturer?.lastName}, {selectedLecturer?.firstName}</p>
                  <p className="text-gray-700"><span className="font-medium">Time:</span> {selectedTimeSlot.dayOfWeek} {selectedTimeSlot.startTime}-{selectedTimeSlot.endTime}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                  onClick={handleReset}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Batch Mode Toggle (future feature) */}
      <div className="mt-6 flex justify-between items-center">
        <button
          className="text-gray-500 hover:text-gray-700 text-sm"
          onClick={handleReset}
        >
          Reset Workflow
        </button>
        
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={batchMode}
            onChange={() => setBatchMode(!batchMode)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            Batch Assignment Mode
          </span>
        </label>
      </div>
    </div>
  );
};

export default CourseAssignment;