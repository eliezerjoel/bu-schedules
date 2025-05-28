'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeeklyTimetable = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Days of the week for headers
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Time slots - adjust as needed
  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00'
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/scheduled-classes/instructor/6811d0540f79d80d29592792');
        console.log('Fetched schedule:', response.data);
        setSchedule(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load schedule');
        setLoading(false);
        console.error('Error fetching schedule:', err);
      }
    };

    fetchSchedule();
  }, []);
// Group classes by day and time for easier rendering
const groupClasses = () => {
  const grouped = {};

  days.forEach(day => {
    grouped[day] = {};
    timeSlots.forEach(slot => {
      grouped[day][slot] = [];
    });
  });

  schedule.forEach(cls => {
    const day = cls.dayOfWeek; // Assuming dayOfWeek matches your day names
    
    // Extract only the hour and minute parts for comparison
    const startTimeWithoutSeconds = cls.startTime.substring(0, 5); // "HH:MM"
    const endTimeWithoutSeconds = cls.endTime.substring(0, 5);     // "HH:MM"
    
    const timeKey = `${startTimeWithoutSeconds} - ${endTimeWithoutSeconds}`;

    // Ensure day matches the array's capitalized format if your backend uses a different case
    const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    // Check if the formattedDay and timeKey exist in grouped before pushing
    if (grouped[formattedDay] && grouped[formattedDay][timeKey]) {
      grouped[formattedDay][timeKey].push(cls);
    }
  });

  return grouped;
};

  const groupedClasses = groupClasses();

  if (loading) return <div className="text-center p-4">Loading timetable...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weekly Timetable</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Time</th>
              {days.map(day => (
                <th key={day} className="border p-2 bg-gray-100">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, index) => (
              <React.Fragment key={timeSlot}>
                <tr>
                  <td className="border p-2 bg-gray-50" rowSpan="2">{timeSlot}</td>
                  {days.map(day => {
                    const classes = groupedClasses[day][timeSlot];
                    return (
                      <td key={`${day}-${timeSlot}`} className="border p-1">
                        {classes.map(cls => (
                          <div key={cls.id} className="mb-1 p-1 bg-blue-50 rounded">
                            <div className="font-medium">{cls.course?.courseName || 'No course'}</div>
                            <div className="text-sm">{cls.course?.courseCode || ''}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  {days.map(day => {
                    const classes = groupedClasses[day][timeSlot];
                    return (
                      <td key={`${day}-${timeSlot}-details`} className="border p-1">
                        {classes.map(cls => (
                          <div key={`${cls.id}-details`} className="text-xs mb-1">
                            <div>{cls.room || 'No room'}</div>
                            <div>{cls.instructor?.name || 'No instructor'}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyTimetable;