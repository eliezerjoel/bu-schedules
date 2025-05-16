
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditStudentGroup({ groupId }) {
  const [groupName, setGroupName] = useState('');
  const [program, setProgram] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the student group data when component mounts
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/student-groups/${groupId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setGroupName(data.groupName);
        setProgram(data.program);
        setNumberOfStudents(data.numberOfStudents?.toString() || '');
        setError(null);
      } catch (err) {
        setError('Failed to load student group data. Please try again later.');
        console.error('Error fetching student group:', err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!groupName || !program || !numberOfStudents) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/student-groups/${groupId}`, {
        method: 'PUT',
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
        throw new Error(`Failed to update student group: ${response.status} - ${errorData?.message || response.statusText}`);
      }

      router.push('/student-groups'); // Redirect to student groups page after successful update
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading student group data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Student Group</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-gray-700 font-medium mb-2">
              Group Name:
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              min="1"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link href="/student-groups" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              Cancel
            </Link>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
