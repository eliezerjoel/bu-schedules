// // app/courses/add/page.js
'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function AddCourse() {
//   const [courseCode, setCourseCode] = useState('');
//   const [courseName, setCourseName] = useState('');
//   const [credits, setCredits] = useState('');
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch('http://localhost:8080/api/courses', { // Adjust URL if needed
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           courseCode,
//           courseName,
//           credits: parseInt(credits, 10),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Failed to add course: ${response.status} - ${errorData?.message || response.statusText}`);
//       }

//       router.push('/courses/all'); // Redirect to the list of courses after successful creation
//     } catch (e) {
//       setError(e.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Add New Course</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="courseCode">Course Code:</label>
//           <input
//             type="text"
//             id="courseCode"
//             value={courseCode}
//             onChange={(e) => setCourseCode(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="courseName">Course Name:</label>
//           <input
//             type="text"
//             id="courseName"
//             value={courseName}
//             onChange={(e) => setCourseName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="credits">Credits:</label>
//           <input
//             type="number"
//             id="credits"
//             value={credits}
//             onChange={(e) => setCredits(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Add Course</button>
//       </form>
//       <Link href="/courses/all">Back to All Courses</Link>
//     </div>
//   );
// }


import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    credits: '',
    semester: '',
    description: '',
    prerequisites: [],
    lecturer: '',
  });

  const [errors, setErrors] = useState({});
  
  const departments = [
    'Computer Science',
    'Mathematics',
    'Biology',
    'Physics',
    'English',
    'History',
    'Business',
    'Engineering'
  ];
  
  const semesters = [
    'Fall 2025',
    'Spring 2025',
    'Summer 2025',
    'Fall 2026',
    'Spring 2026'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.code) newErrors.code = 'Course code is required';
    if (!formData.name) newErrors.name = 'Course name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.credits) newErrors.credits = 'Credits are required';
    else if (isNaN(formData.credits) || parseInt(formData.credits) <= 0) {
      newErrors.credits = 'Credits must be a positive number';
    }
    if (!formData.semester) newErrors.semester = 'Semester is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Here you would normally submit to your API
      console.log('Submitting course data:', formData);
      alert('Course added successfully!');
      // Reset form or redirect
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <a href="/courses/all" className="mr-3 text-indigo-600 hover:text-indigo-900">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add New Course</h1>
              <p className="mt-1 text-sm text-gray-500">
                Enter the details for the new course
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., COMP101"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>

              {/* Course Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., Introduction to Computing"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department *
                </label>
                <select
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              {/* Credit Hours */}
              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                  Credit Hours *
                </label>
                <input
                  type="number"
                  name="credits"
                  id="credits"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.credits ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., 3"
                />
                {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits}</p>}
              </div>

              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                  Semester *
                </label>
                <select
                  name="semester"
                  id="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.semester ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
                {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
              </div>

              {/* Lecturer */}
              <div>
                <label htmlFor="lecturer" className="block text-sm font-medium text-gray-700">
                  Lecturer
                </label>
                <input
                  type="text"
                  name="lecturer"
                  id="lecturer"
                  value={formData.lecturer}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Dr. John Smith"
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter course description..."
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}