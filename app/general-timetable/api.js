import { NextResponse } from 'next/server';

// Mock data for departments
const departments = [
  {
    id: 'DEPT001',
    name: 'Computer Science',
    code: 'CS',
    color: '#3b82f6', // blue
    facultyCount: 15,
    courseCount: 24,
  },
  {
    id: 'DEPT002',
    name: 'Mathematics',
    code: 'MATH',
    color: '#ef4444', // red
    facultyCount: 12,
    courseCount: 18,
  },
  {
    id: 'DEPT003',
    name: 'Physics',
    code: 'PHYS',
    color: '#10b981', // green
    facultyCount: 10,
    courseCount: 15,
  },
  {
    id: 'DEPT004',
    name: 'Business',
    code: 'BUS',
    color: '#f59e0b', // amber
    facultyCount: 18,
    courseCount: 22,
  },
  {
    id: 'DEPT005',
    name: 'Engineering',
    code: 'ENG',
    color: '#8b5cf6', // purple
    facultyCount: 20,
    courseCount: 30,
  },
];

export async function GET() {
  return NextResponse.json(departments);
}
