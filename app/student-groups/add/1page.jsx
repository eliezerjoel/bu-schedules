
  'use client';
  
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddStudentGroup() {

  const [groupName, setGroupName] = useState('');
  const [program, setProgram] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/student-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName,
          program,
          numberOfStudents: parseInt(numberOfStudents, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add student group: ${response.status} - ${errorData?.message || response.statusText}`);
      }

      router.push('/student-groups'); // Redirect to student groups page after successful creation
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Student Group</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-gray-700 font-medium mb-2">
            Group Name:
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="program" className="block text-gray-700 font-medium mb-2">
            Program:
          </label>
          <input
            type="text"
            id="program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="numberOfStudents" className="block text-gray-700 font-medium mb-2">
            Number of Students:
          </label>
          <input
            type="number"
            id="numberOfStudents"
            value={numberOfStudents}
            onChange={(e) => setNumberOfStudents(e.target.value)}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Student Group
          </button>
          
          <Link 
            href="/student-groups"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Back to All Student Groups
          </Link>
        </div>
      </form>
    </div>
  );
}
