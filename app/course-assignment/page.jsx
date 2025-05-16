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
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // Fetch all courses on component mount
  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get('http://localhost:8080/api/courses');
  //       setCourses(response.data);
  //     } catch (err) {
  //       setError('Failed to load courses. Please try again.');
  //       console.error('Error fetching courses:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchCourses();
  // }, []);
  
    
  // Fetch courses from backend API
  useEffect(() => {
    fetch('http://localhost:8080/api/courses')
    .then((res) => res.json())
    .then((data) => setCourses(data))
    .catch((err) => {
      console.error('Failed to fetch courses:', err);
      setCourses([]);
    });
  }, []);

  // Fetch available lecturers when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      fetch(`http://localhost:8080/api/instructors?courseId=${selectedCourse.id}`)
        .then((res) => res.json())
        .then((data) => {
          setLecturers(data);
          setCurrentStep(2);
        })
        .catch((err) => {
          setError('Failed to load lecturers. Please try again.');
          console.error('Error fetching lecturers:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedCourse]);
  
  // Fetch available time slots when a lecturer is selected
  useEffect(() => {
    if (selectedCourse && selectedLecturer) {
      const fetchTimeSlots = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/timetable/timeslots/available?courseId=${selectedCourse.id}&lecturerId=${selectedLecturer.id}`
          );
          setTimeSlots(response.data);
        } catch (err) {
          setError('Failed to load time slots. Please try again.');
          console.error('Error fetching time slots:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTimeSlots();
      setCurrentStep(3);
    }
  }, [selectedLecturer, selectedCourse]);
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedLecturer(null);
    setSelectedTimeSlot(null);
    setSuccess(null);
    setError(null);
  };
  
  // Handle lecturer selection
  const handleLecturerSelect = (lecturer) => {
    setSelectedLecturer(lecturer);
    setSelectedTimeSlot(null);
    setSuccess(null);
    setError(null);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSuccess(null);
    setError(null);
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    if (!selectedCourse || !selectedLecturer || !selectedTimeSlot) {
      setError('Please complete all selections before submitting.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('/api/timetable/assign', {
        courseId: selectedCourse.id,
        lecturerId: selectedLecturer.id,
        dayOfWeek: selectedTimeSlot.dayOfWeek,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime
      });
      
      setSuccess(`Successfully assigned ${selectedCourse.name} to ${selectedLecturer.name} on ${selectedTimeSlot.dayOfWeek} at ${selectedTimeSlot.startTime}`);
      
      // Reset selections for next assignment
      setSelectedCourse(null);
      setSelectedLecturer(null);
      setSelectedTimeSlot(null);
      setCurrentStep(1);
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
      
      {/* Step 1: Course Selection */}
      <div className={`mb-6 ${currentStep === 1 ? 'block' : 'hidden'}`}>
        <h2 className="text-xl font-semibold mb-4">Step 1: Select a Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`border p-4 rounded cursor-pointer ${
                selectedCourse?.id === course.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleCourseSelect(course)}
            >
              <h3 className="font-medium">{course.courseName}</h3>
              <p className="text-gray-600">{course.courseCode}</p>
              <p className="text-sm text-gray-500">{course.credits} credits</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step 2: Lecturer Assignment */}
      <div className={`mb-6 ${currentStep === 2 ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Step 2: Assign a Lecturer</h2>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedCourse(null);
              setCurrentStep(1);
            }}
          >
            ← Back to Courses
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-medium">Selected Course: {selectedCourse?.name} ({selectedCourse?.courseCode})</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lecturers.length > 0 ? (
            lecturers.map((lecturer) => (
              <div
                key={lecturer.id}
                className={`border p-4 rounded cursor-pointer ${
                  selectedLecturer?.id === lecturer.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLecturerSelect(lecturer)}
              >
                <h3 className="font-medium">{lecturer.lastName} {lecturer.firstName}</h3>
                <p className="text-gray-600">{lecturer.department}</p>
                <p className="text-sm text-gray-500">{lecturer.qualifications}</p>
              </div>
            ))
          ) : (
            <p>No lecturers available for this course. Please select a different course.</p>
          )}
        </div>
      </div>
      
      {/* Step 3: Time Slot Selection */}
      <div className={`mb-6 ${currentStep === 3 ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Step 3: Choose Time Slot</h2>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedLecturer(null);
              setCurrentStep(2);
            }}
          >
            ← Back to Lecturers
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-medium">Selected Course: {selectedCourse?.name} ({selectedCourse?.code})</p>
          <p className="font-medium">Selected Lecturer: {selectedLecturer?.name}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Day</th>
                <th className="py-2 px-4 border">Time</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <tr key={index} className={selectedTimeSlot === slot ? 'bg-blue-100' : ''}>
                    <td className="py-2 px-4 border">{slot.dayOfWeek}</td>
                    <td className="py-2 px-4 border">{`${slot.startTime} - ${slot.endTime}`}</td>
                    <td className="py-2 px-4 border">
                      <button
                        className={`px-3 py-1 rounded ${
                          selectedTimeSlot === slot
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {selectedTimeSlot === slot ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center">
                    No available time slots for this combination. Please select a different lecturer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {selectedTimeSlot && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Assignment Summary:</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Course: {selectedCourse?.name} ({selectedCourse?.code})</li>
              <li>Lecturer: {selectedLecturer?.name}</li>
              <li>Day: {selectedTimeSlot.dayOfWeek}</li>
              <li>Time: {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</li>
            </ul>
            
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Confirm Assignment
            </button>
          </div>
        )}
      </div>
      
      {/* Reset Button */}
      {currentStep > 1 && (
        <div className="mt-6">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleReset}
          >
            Reset and Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseAssignment;