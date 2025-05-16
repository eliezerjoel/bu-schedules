'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, X, Loader2, User, Calendar, BookOpen, Mail, Phone, Clock, Award, Building, BookMarked, Briefcase } from 'lucide-react';
//import InstructorSchedule from '../../components/InstructorSchedule';
//import instructorService from '../../services/instructorService';

export default function InstructorDetails({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    officeHours: '',
    phoneNumber: '',
    position: '',
    specialization: ''
  });

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/instructors/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInstructor(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          department: data.department || '',
          officeHours: data.officeHours || '',
          phoneNumber: data.phoneNumber || '',
          position: data.position || '',
          specialization: data.specialization || ''
        });
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    
    const fetchAssignedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/instructors/${id}/courses`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAssignedCourses(data);
      } catch (e) {
        console.error("Failed to fetch assigned courses:", e);
      }
    };
    
    fetchInstructor();
    fetchAssignedCourses();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/instructors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedInstructor = await response.json();
      setInstructor(updatedInstructor);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: instructor.firstName || '',
      lastName: instructor.lastName || '',
      email: instructor.email || '',
      department: instructor.department || '',
      officeHours: instructor.officeHours || '',
      phoneNumber: instructor.phoneNumber || '',
      position: instructor.position || '',
      specialization: instructor.specialization || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading instructor details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-auto my-8 max-w-4xl">
        <p className="font-medium">Error loading instructor</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => router.push('/instructors')}
          className="mt-2 bg-white border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50"
        >
          Back to Instructors
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center">
        <Link href="/instructors" className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800">
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Instructors</span>
        </Link>
        <h1 className="text-2xl font-bold flex-grow">
          Instructor Details {isEditing ? '(Editing)' : ''}
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit Instructor
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="department">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="position">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="specialization">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="officeHours">
                Office Hours
              </label>
              <input
                type="text"
                id="officeHours"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mon 2-4 PM, Wed 10-12 AM"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">
                      {instructor.firstName} {instructor.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{instructor.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium">{instructor.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-medium">{instructor.department || 'Not assigned'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Position</p>
                    <p className="font-medium">{instructor.position || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Specialization</p>
                    <p className="font-medium">{instructor.specialization || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start sm:col-span-2">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Office Hours</p>
                    <p className="font-medium">{instructor.officeHours || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center">
                <BookMarked className="h-5 w-5 mr-2" />
                Assigned Courses
              </h2>
              {assignedCourses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {assignedCourses.map((course) => (
                    <li key={course.id} className="py-3">
                      <Link href={`/courses/${course.id}`} className="block hover:bg-gray-50 p-2 rounded">
                        <p className="font-medium text-blue-600">{course.courseCode}: {course.courseName}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{course.semester}</span>
                          <span className="mx-2">•</span>
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{course.creditHours} credits</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No courses currently assigned to this instructor.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}