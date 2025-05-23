'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarIcon, Clock, Download, Edit, FileText, Filter, List, MapPin, MoreHorizontal, Plus, Printer, RefreshCw, Search, Share2, User, Users, BookOpen, BarChart, AlertCircle, CheckCircle, XCircle, Building2, Briefcase, CalendarDays, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Settings, Save, Trash2, Eye, EyeOff, FileDown, PieChart, Sliders, HelpCircle, Info, Bell, Layers, Grid, Columns, ArrowUpDown, ArrowDownUp, Maximize2, Minimize2, Zap, AlertTriangle, ClipboardList, FileSpreadsheet, Mail, MessageSquare, Home } from 'lucide-react';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Define types
interface Department {
  id: string;
  name: string;
  code: string;
  color: string;
  facultyCount: number;
  courseCount: number;
}

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: Department;
  color: string;
}

interface Lecturer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  title: string;
  officeLocation: string;
  phoneNumber: string;
  currentWorkload: number;
  maxWorkload: number;
}

interface StudentGroup {
  id: string;
  name: string;
  program: string;
  year: number;
  size: number;
  department: Department;
}

interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  hasProjector: boolean;
  hasComputers: boolean;
  department: Department;
}

interface ScheduledClass {
  id: string;
  course: Course;
  lecturer: Lecturer;
  studentGroup: StudentGroup;
  room: Room;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  semester: string;
  academicYear: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR';
  hasConflict: boolean;
  conflictReason?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ScheduledClass;
  hasConflict: boolean;
}

interface ConflictReport {
  id: string;
  type: 'LECTURER' | 'ROOM' | 'STUDENT_GROUP';
  description: string;
  classes: ScheduledClass[];
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
}

interface UtilizationStats {
  roomUtilization: {
    totalRooms: number;
    usedRooms: number;
    utilizationRate: number;
    utilizationByBuilding: { [key: string]: number };
    utilizationByType: { [key: string]: number };
  };
  lecturerWorkload: {
    totalLecturers: number;
    averageWorkload: number;
    overloadedLecturers: number;
    underutilizedLecturers: number;
    workloadByDepartment: { [key: string]: number };
  };
  courseDistribution: {
    totalCourses: number;
    coursesByDepartment: { [key: string]: number };
    averageClassSize: number;
  };
  timeSlotUtilization: {
    byDay: { [key: string]: number };
    byHour: { [key: string]: number };
    peakHours: string[];
    lowUtilizationHours: string[];
  };
}

const GeneralTimetable = () => {
  // State
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [conflicts, setConflicts] = useState<ConflictReport[]>([]);
  const [stats, setStats] = useState<UtilizationStats | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'week' | 'day' | 'month' | 'agenda'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [showAddClass, setShowAddClass] = useState<boolean>(false);
  const [showBulkImport, setShowBulkImport] = useState<boolean>(false);
  const [showConflictDetails, setShowConflictDetails] = useState<boolean>(false);
  const [selectedConflict, setSelectedConflict] = useState<ConflictReport | null>(null);
  
  const [filters, setFilters] = useState({
    departments: [] as string[],
    courses: [] as string[],
    lecturers: [] as string[],
    rooms: [] as string[],
    studentGroups: [] as string[],
    classTypes: [] as string[],
    days: [] as string[],
    timeRange: { start: '08:00', end: '18:00' },
    showConflicts: false,
    search: '',
  });
  
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'departments' | 'lecturers' | 'rooms' | 'analytics'>('schedule');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({ key: 'dayOfWeek', direction: 'ascending' });
  
  const [newClass, setNewClass] = useState({
    courseId: '',
    lecturerId: '',
    studentGroupId: '',
    roomId: '',
    dayOfWeek: 'MONDAY',
    startTime: '08:00',
    endTime: '09:30',
    type: 'LECTURE',
    semester: 'Fall',
    academicYear: '2023/2024',
  });
  
  const [bulkImportData, setBulkImportData] = useState<string>('');
  const [bulkImportErrors, setBulkImportErrors] = useState<string[]>([]);
  
  // Fetch timetable data
  useEffect(() => {
    const fetchTimetableData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be separate API calls
        const departmentsResponse = await axios.get('/api/admin/departments');
        const lecturersResponse = await axios.get('/api/admin/lecturers');
        const roomsResponse = await axios.get('/api/admin/rooms');
        const studentGroupsResponse = await axios.get('/api/admin/student-groups');
        const coursesResponse = await axios.get('/api/admin/courses');
        const classesResponse = await axios.get('/api/admin/classes');
        const conflictsResponse = await axios.get('/api/admin/conflicts');
        const statsResponse = await axios.get('/api/admin/stats');
        
        setDepartments(departmentsResponse.data);
        setLecturers(lecturersResponse.data);
        setRooms(roomsResponse.data);
        setStudentGroups(studentGroupsResponse.data);
        setCourses(coursesResponse.data);
        setClasses(classesResponse.data);
        setConflicts(conflictsResponse.data);
        setStats(statsResponse.data);
        
        // Convert to calendar events
        convertToCalendarEvents(classesResponse.data);
      } catch (err) {
        console.error('Error fetching timetable data:', err);
        setError('Failed to load timetable data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableData();
  }, []);

  // Convert scheduled classes to calendar events
  const convertToCalendarEvents = (classes: ScheduledClass[]) => {
    const events: CalendarEvent[] = [];
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Map day strings to numbers
    const dayMap: {[key: string]: number} = {
      'SUNDAY': 0,
      'MONDAY': 1,
      'TUESDAY': 2,
      'WEDNESDAY': 3,
      'THURSDAY': 4,
      'FRIDAY': 5,
      'SATURDAY': 6
    };

    // Process classes
    classes.forEach(cls => {
      const classDay = dayMap[cls.dayOfWeek];
      
      // Calculate the date for this class based on current week
      const date = new Date(currentDate);
      const diff = classDay - currentDay;
      date.setDate(date.getDate() + diff);
      
      // Parse times
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      
      // Create start and end dates
      const start = new Date(date);
      start.setHours(startHour, startMinute, 0);
      
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0);
      
      // Create the event
      events.push({
        id: cls.id,
        title: `${cls.course.code}: ${cls.course.name}`,
        start,
        end,
        resource: cls,
        hasConflict: cls.hasConflict
      });
    });
    
    setEvents(events);
  };

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const cls = event.resource;
      
      // Filter by departments
      if (filters.departments.length > 0 && !filters.departments.includes(cls.course.department.id)) {
        return false;
      }
      
      // Filter by courses
      if (filters.courses.length > 0 && !filters.courses.includes(cls.course.id)) {
        return false;
      }
      
      // Filter by lecturers
      if (filters.lecturers.length > 0 && !filters.lecturers.includes(cls.lecturer.id)) {
        return false;
      }
      
      // Filter by rooms
      if (filters.rooms.length > 0 && !filters.rooms.includes(cls.room.id)) {
        return false;
      }
      
      // Filter by student groups
      if (filters.studentGroups.length > 0 && !filters.studentGroups.includes(cls.studentGroup.id)) {
        return false;
      }
      
      // Filter by class types
      if (filters.classTypes.length > 0 && !filters.classTypes.includes(cls.type)) {
        return false;
      }
      
      // Filter by days
      if (filters.days.length > 0 && !filters.days.includes(cls.dayOfWeek)) {
        return false;
      }
      
      // Filter by time range
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      const [filterStartHour, filterStartMinute] = filters.timeRange.start.split(':').map(Number);
      const [filterEndHour, filterEndMinute] = filters.timeRange.end.split(':').map(Number);
      
      const classStartMinutes = startHour * 60 + startMinute;
      const classEndMinutes = endHour * 60 + endMinute;
      const filterStartMinutes = filterStartHour * 60 + filterStartMinute;
      const filterEndMinutes = filterEndHour * 60 + filterEndMinute;
      
      if (classStartMinutes < filterStartMinutes || classEndMinutes > filterEndMinutes) {
        return false;
      }
      
      // Filter by conflicts
      if (filters.showConflicts && !cls.hasConflict) {
        return false;
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          cls.course.name.toLowerCase().includes(searchTerm) ||
          cls.course.code.toLowerCase().includes(searchTerm) ||
          cls.lecturer.firstName.toLowerCase().includes(searchTerm) ||
          cls.lecturer.lastName.toLowerCase().includes(searchTerm) ||
          cls.studentGroup.name.toLowerCase().includes(searchTerm) ||
          cls.room.name.toLowerCase().includes(searchTerm) ||
          cls.room.building.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  }, [events, filters]);

  // Apply sorting to classes list
  const sortedClasses = useMemo(() => {
    const sortableClasses = [...classes];
    
    if (sortConfig.key) {
      sortableClasses.sort((a, b) => {
        // Handle nested properties
        let aValue, bValue;
        
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj[key], a);
          bValue = keys.reduce((obj, key) => obj[key], b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        // Special handling for time values
        if (sortConfig.key === 'startTime' || sortConfig.key === 'endTime') {
          const [aHour, aMinute] = aValue.split(':').map(Number);
          const [bHour, bMinute] = bValue.split(':').map(Number);
          
          aValue = aHour * 60 + aMinute;
          bValue = bHour * 60 + bMinute;
        }
        
        // Special handling for day of week
        if (sortConfig.key === 'dayOfWeek') {
          const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
          aValue = dayOrder.indexOf(aValue);
          bValue = dayOrder.indexOf(bValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableClasses;
  }, [classes, sortConfig]);

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Handle view change
  const handleViewChange = (newView: 'week' | 'day' | 'month' | 'agenda') => {
    setView(newView);
  };

  // Handle date change
  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Request sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Toggle filter
  const toggleFilter = (filterType: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      departments: [],
      courses: [],
      lecturers: [],
      rooms: [],
      studentGroups: [],
      classTypes: [],
      days: [],
      timeRange: { start: '08:00', end: '18:00' },
      showConflicts: false,
      search: '',
    });
  };

  // Add new class
  const handleAddClass = async () => {
    try {
      // In a real app, this would call your API
      const response = await axios.post('/api/admin/classes', newClass);
      
      // Add the new class to state
      const newClassData = response.data;
      setClasses([...classes, newClassData]);
      
      // Update calendar events
      convertToCalendarEvents([...classes, newClassData]);
      
      // Close the dialog
      setShowAddClass(false);
      
      // Reset form
      setNewClass({
        courseId: '',
        lecturerId: '',
        studentGroupId: '',
        roomId: '',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '09:30',
        type: 'LECTURE',
        semester: 'Fall',
        academicYear: '2023/2024',
      });
    } catch (err) {
      console.error('Error adding class:', err);
      alert('Failed to add class. Please check for conflicts and try again.');
    }
  };

  // Handle bulk import
  const handleBulkImport = async () => {
    try {
      // In a real app, this would call your API
      const response = await axios.post('/api/admin/classes/bulk-import', { data: bulkImportData });
      
      // Update classes
      setClasses([...classes, ...response.data.classes]);
      
      // Update calendar events
      convertToCalendarEvents([...classes, ...response.data.classes]);
      
      // Check for errors
      if (response.data.errors && response.data.errors.length > 0) {
        setBulkImportErrors(response.data.errors);
      } else {
        // Close the dialog
        setShowBulkImport(false);
        
        // Reset form
        setBulkImportData('');
        setBulkImportErrors([]);
      }
    } catch (err) {
      console.error('Error with bulk import:', err);
      setBulkImportErrors(['Failed to process bulk import. Please check your data format.']);
    }
  };

  // Delete class
  const handleDeleteClass = async (classId: string) => {
    try {
      // In a real app, this would call your API
      await axios.delete(`/api/admin/classes/${classId}`);
      
      // Remove the class from state
      const updatedClasses = classes.filter(cls => cls.id !== classId);
      setClasses(updatedClasses);
      
      // Update calendar events
      convertToCalendarEvents(updatedClasses);
      
      // Close the dialog if open
      setShowEventDetails(false);
    } catch (err) {
      console.error('Error deleting class:', err);
      alert('Failed to delete class. Please try again.');
    }
  };

  // Resolve conflict
  const handleResolveConflict = async (conflictId: string) => {
    try {
      // In a real app, this would call your API
      await axios.post(`/api/admin/conflicts/${conflictId}/resolve`);
      
      // Update conflicts list
      const updatedConflicts = conflicts.filter(conflict => conflict.id !== conflictId);
      setConflicts(updatedConflicts);
      
      // Close the dialog if open
      setShowConflictDetails(false);
      setSelectedConflict(null);
    } catch (err) {
      console.error('Error resolving conflict:', err);
      alert('Failed to resolve conflict. Please try again.');
    }
  };

  // Export timetable as PDF
  const exportAsPDF = () => {
    // In a real app, this would call a PDF generation service
    alert('Exporting timetable as PDF...');
    // window.open('/api/admin/timetable/pdf', '_blank');
  };

  // Export to Excel
  const exportToExcel = () => {
    // In a real app, this would generate an Excel file
    alert('Exporting to Excel...');
    // window.location.href = '/api/admin/timetable/excel';
  };

  // Custom event component for the calendar
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const cls = event.resource;
    return (
      <div 
        className={`rounded p-1 overflow-hidden h-full ${
          cls.hasConflict ? 'border-2 border-red-500' : ''
        }`}
        style={{ backgroundColor: cls.course.department.color || '#3b82f6' }}
      >
        <div className="text-white font-medium text-xs truncate">
          {cls.course.code}
        </div>
        <div className="text-white text-xs truncate">
          {cls.lecturer.lastName}, {cls.room.name}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()} className="ml-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">University Timetable Management</h1>
            <p className="text-gray-500">
              Academic Year: 2023/2024 • Semester: Fall
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportAsPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Timetable
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowAddClass(true)}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Add Class
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowBulkImport(true)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Bulk Import
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Building2 className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold">{departments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <BookOpen className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courses</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <Briefcase className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lecturers</p>
                  <p className="text-2xl font-bold">{lecturers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conflicts</p>
                  <p className="text-2xl font-bold">{conflicts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle>Filter Options</CardTitle>
              <CardDescription>Customize your timetable view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search courses, lecturers, rooms..."
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Department Filter */}
                <div>
                  <Label>Departments</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {departments.map(dept => (
                      <div key={dept.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dept-${dept.id}`}
                          checked={filters.departments.includes(dept.id)}
                          onCheckedChange={() => toggleFilter('departments', dept.id)}
                        />
                        <label
                          htmlFor={`dept-${dept.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {dept.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Class Type Filter */}
                <div>
                  <Label>Class Types</Label>
                  <div className="mt-2 space-y-2">
                    {['LECTURE', 'LAB', 'TUTORIAL', 'SEMINAR'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.classTypes.includes(type)}
                          onCheckedChange={() => toggleFilter('classTypes', type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm cursor-pointer"
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Day Filter */}
                <div>
                  <Label>Days</Label>
                  <div className="mt-2 space-y-2">
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={filters.days.includes(day)}
                          onCheckedChange={() => toggleFilter('days', day)}
                        />
                        <label
                          htmlFor={`day-${day}`}
                          className="text-sm cursor-pointer"
                        >
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Time Range */}
                <div>
                  <Label>Time Range</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="timeStart" className="text-xs">Start</Label>
                      <Select 
                        value={filters.timeRange.start}
                        onValueChange={(value) => setFilters(prev => ({ 
                          ...prev, 
                          timeRange: { ...prev.timeRange, start: value } 
                        }))}
                      >
                        <SelectTrigger id="timeStart">
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeEnd" className="text-xs">End</Label>
                      <Select 
                        value={filters.timeRange.end}
                        onValueChange={(value) => setFilters(prev => ({ 
                          ...prev, 
                          timeRange: { ...prev.timeRange, end: value } 
                        }))}
                      >
                        <SelectTrigger id="timeEnd">
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Show Conflicts */}
                <div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id="showConflicts"
                      checked={filters.showConflicts}
                      onCheckedChange={(checked) => setFilters(prev => ({ 
                        ...prev, 
                        showConflicts: checked === true 
                      }))}
                    />
                    <label
                      htmlFor="showConflicts"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Show only conflicts
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Advanced Filters (Accordion) */}
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="advanced-filters">
                  <AccordionTrigger>Advanced Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Lecturer Filter */}
                      <div>
                        <Label>Lecturers</Label>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {lecturers.map(lecturer => (
                            <div key={lecturer.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`lecturer-${lecturer.id}`}
                                checked={filters.lecturers.includes(lecturer.id)}
                                onCheckedChange={() => toggleFilter('lecturers', lecturer.id)}
                              />
                              <label
                                htmlFor={`lecturer-${lecturer.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {lecturer.title} {lecturer.firstName} {lecturer.lastName}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Room Filter */}
                      <div>
                        <Label>Rooms</Label>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {rooms.map(room => (
                            <div key={room.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`room-${room.id}`}
                                checked={filters.rooms.includes(room.id)}
                                onCheckedChange={() => toggleFilter('rooms', room.id)}
                              />
                              <label
                                htmlFor={`room-${room.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {room.name}, {room.building}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Student Group Filter */}
                      <div>
                        <Label>Student Groups</Label>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {studentGroups.map(group => (
                            <div key={group.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`group-${group.id}`}
                                checked={filters.studentGroups.includes(group.id)}
                                onCheckedChange={() => toggleFilter('studentGroups', group.id)}
                              />
                              <label
                                htmlFor={`group-${group.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {group.name} ({group.size} students)
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Main Tabs */}
        <Tabs defaultValue="schedule" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule">
            {/* Conflicts Alert */}
            {conflicts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {conflicts.length} scheduling conflicts detected
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        There are scheduling conflicts that need to be resolved. 
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-red-700 underline"
                          onClick={() => {
                            setSelectedConflict(conflicts[0]);
                            setShowConflictDetails(true);
                          }}
                        >
                          View conflicts
                        </Button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* View Selector */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button 
                  variant={view === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleViewChange('day')}
                >
                  Day
                </Button>
                <Button 
                  variant={view === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleViewChange('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={view === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleViewChange('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={view === 'agenda' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleViewChange('agenda')}
                >
                  List
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredEvents.length} classes • {departments.length} departments
              </div>
            </div>
            
            {/* Calendar View */}
            <Card>
              <CardContent className="p-0 overflow-hidden">
                <div className="h-[600px]">
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={(newView) => handleViewChange(newView as any)}
                    date={currentDate}
                    onNavigate={handleNavigate}
                    onSelectEvent={handleSelectEvent}
                    components={{
                      event: EventComponent as any,
                    }}
                    formats={{
                      timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),
                      eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
                        return `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`;
                      },
                    }}
                    min={new Date(0, 0, 0, 8, 0)} // 8:00 AM
                    max={new Date(0, 0, 0, 18, 0)} // 6:00 PM
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Class List View */}
            <Card className="mt-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Classes</CardTitle>
                    <CardDescription>All scheduled classes</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search classes..."
                      className="w-64"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowAddClass(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('course.code')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Code
                            {sortConfig.key === 'course.code' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('course.name')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Course
                            {sortConfig.key === 'course.name' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('lecturer.lastName')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Lecturer
                            {sortConfig.key === 'lecturer.lastName' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('dayOfWeek')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Day
                            {sortConfig.key === 'dayOfWeek' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('startTime')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Time
                            {sortConfig.key === 'startTime' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('room.name')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Room
                            {sortConfig.key === 'room.name' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('studentGroup.name')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Student Group
                            {sortConfig.key === 'studentGroup.name' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort('type')}
                            className="flex items-center p-0 h-auto font-medium"
                          >
                            Type
                            {sortConfig.key === 'type' && (
                              sortConfig.direction === 'ascending' ? 
                                <ChevronUp className="ml-1 h-4 w-4" /> : 
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedClasses
                        .filter(cls => {
                          // Apply the same filters as for the calendar
                          if (filters.search) {
                            const searchTerm = filters.search.toLowerCase();
                            return (
                              cls.course.name.toLowerCase().includes(searchTerm) ||
                              cls.course.code.toLowerCase().includes(searchTerm) ||
                              cls.lecturer.firstName.toLowerCase().includes(searchTerm) ||
                              cls.lecturer.lastName.toLowerCase().includes(searchTerm) ||
                              cls.studentGroup.name.toLowerCase().includes(searchTerm) ||
                              cls.room.name.toLowerCase().includes(searchTerm) ||
                              cls.room.building.toLowerCase().includes(searchTerm)
                            );
                          }
                          return true;
                        })
                        .slice(0, 10) // Limit to 10 rows for performance
                        .map(cls => (
                          <TableRow key={cls.id} className={cls.hasConflict ? 'bg-red-50' : ''}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: cls.course.department.color }}
                                ></div>
                                {cls.course.code}
                              </div>
                            </TableCell>
                            <TableCell>{cls.course.name}</TableCell>
                            <TableCell>
                              {cls.lecturer.title} {cls.lecturer.firstName} {cls.lecturer.lastName}
                            </TableCell>
                            <TableCell>{cls.dayOfWeek.charAt(0) + cls.dayOfWeek.slice(1).toLowerCase()}</TableCell>
                            <TableCell>{cls.startTime} - {cls.endTime}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {cls.room.name}
                              </div>
                            </TableCell>
                            <TableCell>{cls.studentGroup.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {cls.type.charAt(0) + cls.type.slice(1).toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    // Find the event for this class
                                    const event = events.find(e => e.resource.id === cls.id);
                                    if (event) {
                                      setSelectedEvent(event);
                                      setShowEventDetails(true);
                                    }
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would open an edit dialog
                                    alert(`Edit class ${cls.course.code}`);
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteClass(cls.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Showing 10 of {sortedClasses.length} classes
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Departments Tab */}
          <TabsContent value="departments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department List */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Departments</CardTitle>
                      <CardDescription>All academic departments</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Faculty</TableHead>
                          <TableHead>Courses</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map(dept => (
                          <TableRow key={dept.id}>
                            <TableCell>
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: dept.color }}
                              ></div>
                            </TableCell>
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell>{dept.code}</TableCell>
                            <TableCell>{dept.facultyCount}</TableCell>
                            <TableCell>{dept.courseCount}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would navigate to department details
                                    alert(`View ${dept.name} details`);
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would open an edit dialog
                                    alert(`Edit ${dept.name}`);
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would filter the schedule
                                    setFilters(prev => ({
                                      ...prev,
                                      departments: [dept.id],
                                    }));
                                    setActiveTab('schedule');
                                  }}>
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    View Schedule
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              {/* Department Workload */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Workload</CardTitle>
                  <CardDescription>Teaching hours by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map(dept => {
                      // Calculate workload percentage (in a real app, this would come from the API)
                      const workloadPercentage = Math.floor(Math.random() * 100);
                      
                      return (
                        <div key={dept.id} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{dept.name}</span>
                            <span className="text-sm text-gray-500">{workloadPercentage}%</span>
                          </div>
                          <Progress value={workloadPercentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Department Course Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Distribution</CardTitle>
                  <CardDescription>Courses by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-around">
                    {departments.map(dept => {
                      const height = (dept.courseCount / Math.max(...departments.map(d => d.courseCount))) * 100;
                      
                      return (
                        <div key={dept.id} className="flex flex-col items-center">
                          <div 
                            className="w-16 rounded-t" 
                            style={{ 
                              height: `${height}%`,
                              backgroundColor: dept.color
                            }}
                          ></div>
                          <p className="text-xs mt-2">{dept.code}</p>
                          <p className="text-xs text-gray-500">{dept.courseCount} courses</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Lecturers Tab */}
          <TabsContent value="lecturers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Lecturers</CardTitle>
                    <CardDescription>All faculty members</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search lecturers..."
                      className="w-64"
                    />
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lecturer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Workload</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lecturers.map(lecturer => (
                        <TableRow key={lecturer.id}>
                          <TableCell className="font-medium">
                            {lecturer.firstName} {lecturer.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: lecturer.department.color }}
                              ></div>
                              {lecturer.department.name}
                            </div>
                          </TableCell>
                          <TableCell>{lecturer.title}</TableCell>
                          <TableCell>{lecturer.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Progress 
                                value={(lecturer.currentWorkload / lecturer.maxWorkload) * 100} 
                                className="h-2 w-24 mr-2" 
                              />
                              <span className="text-sm">
                                {lecturer.currentWorkload}/{lecturer.maxWorkload} hrs
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  // In a real app, this would navigate to lecturer details
                                  alert(`View ${lecturer.firstName} ${lecturer.lastName}'s details`);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // In a real app, this would open an edit dialog
                                  alert(`Edit ${lecturer.firstName} ${lecturer.lastName}`);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // In a real app, this would filter the schedule
                                  setFilters(prev => ({
                                    ...prev,
                                    lecturers: [lecturer.id],
                                  }));
                                  setActiveTab('schedule');
                                }}>
                                  <CalendarDays className="h-4 w-4 mr-2" />
                                  View Schedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Showing {lecturers.length} lecturers
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Workload Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workload Distribution</CardTitle>
                  <CardDescription>Faculty workload by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map(dept => {
                      // Calculate average workload for this department
                      const deptLecturers = lecturers.filter(l => l.department.id === dept.id);
                      const avgWorkload = deptLecturers.length > 0 
                        ? deptLecturers.reduce((sum, l) => sum + (l.currentWorkload / l.maxWorkload), 0) / deptLecturers.length * 100
                        : 0;
                      
                      return (
                        <div key={dept.id} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{dept.name}</span>
                            <span className="text-sm text-gray-500">{avgWorkload.toFixed(0)}%</span>
                          </div>
                          <Progress value={avgWorkload} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Overloaded Lecturers</CardTitle>
                  <CardDescription>Lecturers with high workload</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lecturers
                      .filter(l => (l.currentWorkload / l.maxWorkload) > 0.9)
                      .map(lecturer => {
                        const workloadPercentage = (lecturer.currentWorkload / lecturer.maxWorkload) * 100;
                        
                        return (
                          <div key={lecturer.id} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                {lecturer.firstName} {lecturer.lastName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {lecturer.currentWorkload}/{lecturer.maxWorkload} hrs
                              </span>
                            </div>
                            <Progress 
                              value={workloadPercentage} 
                              className={`h-2 ${workloadPercentage > 100 ? 'bg-red-200' : ''}`}
                            />
                            <div className="text-xs text-gray-500">
                              {lecturer.department.name}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Room List */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Rooms</CardTitle>
                      <CardDescription>All teaching spaces</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Room
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Building</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Features</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rooms.map(room => (
                          <TableRow key={room.id}>
                            <TableCell className="font-medium">{room.name}</TableCell>
                            <TableCell>{room.building}, Floor {room.floor}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{room.capacity} seats</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {room.hasProjector && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline" className="bg-blue-50">P</Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Projector</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {room.hasComputers && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline" className="bg-green-50">C</Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Computers</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: room.department.color }}
                                ></div>
                                {room.department.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would navigate to room details
                                    alert(`View ${room.name} details`);
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would open an edit dialog
                                    alert(`Edit ${room.name}`);
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would filter the schedule
                                    setFilters(prev => ({
                                      ...prev,
                                      rooms: [room.id],
                                    }));
                                    setActiveTab('schedule');
                                  }}>
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    View Schedule
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              {/* Room Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Utilization</CardTitle>
                  <CardDescription>Usage statistics for rooms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Overall Utilization</h4>
                      <div className="flex items-center">
                        <Progress value={stats?.roomUtilization.utilizationRate || 0} className="h-2 flex-1 mr-4" />
                        <span className="text-sm font-medium">
                          {stats?.roomUtilization.utilizationRate.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats?.roomUtilization.usedRooms} of {stats?.roomUtilization.totalRooms} rooms in use
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">By Building</h4>
                      <div className="space-y-2">
                        {stats?.roomUtilization.utilizationByBuilding && 
                          Object.entries(stats.roomUtilization.utilizationByBuilding).map(([building, rate]) => (
                            <div key={building} className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-xs">{building}</span>
                                <span className="text-xs text-gray-500">{rate.toFixed(0)}%</span>
                              </div>
                              <Progress value={rate} className="h-1.5" />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">By Room Type</h4>
                      <div className="space-y-2">
                        {stats?.roomUtilization.utilizationByType && 
                          Object.entries(stats.roomUtilization.utilizationByType).map(([type, rate]) => (
                            <div key={type} className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-xs">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                                <span className="text-xs text-gray-500">{rate.toFixed(0)}%</span>
                              </div>
                              <Progress value={rate} className="h-1.5" />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Room Availability Heatmap */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Room Availability Heatmap</CardTitle>
                <CardDescription>Weekly room usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border"></th>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                          <th key={day} className="p-2 border text-center">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'].map(timeSlot => (
                        <tr key={timeSlot}>
                          <td className="p-2 border font-medium">{timeSlot}</td>
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                            // Generate a random utilization percentage for demo purposes
                            // In a real app, this would come from actual data
                            const utilization = Math.floor(Math.random() * 100);
                            let bgColor = 'bg-green-100';
                            if (utilization > 80) bgColor = 'bg-red-100';
                            else if (utilization > 50) bgColor = 'bg-amber-100';
                            
                            return (
                              <td key={`${day}-${timeSlot}`} className={`p-2 border text-center ${bgColor}`}>
                                {utilization}%
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 mr-2"></div>
                    <span className="text-xs">Low (&lt;50%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-100 mr-2"></div>
                    <span className="text-xs">Medium (50-80%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 mr-2"></div>
                    <span className="text-xs">High (&gt;80%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Conflict Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Conflict Analysis</CardTitle>
                  <CardDescription>Current scheduling conflicts</CardDescription>
                </CardHeader>
                <CardContent>
                  {conflicts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                      <h3 className="text-lg font-medium">No Conflicts</h3>
                      <p className="text-sm text-gray-500">
                        The current schedule has no detected conflicts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conflicts.map(conflict => (
                        <div 
                          key={conflict.id} 
                          className={`p-4 rounded-md border ${
                            conflict.severity === 'HIGH' ? 'bg-red-50 border-red-200' :
                            conflict.severity === 'MEDIUM' ? 'bg-amber-50 border-amber-200' :
                            'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">
                                {conflict.type === 'LECTURER' ? 'Lecturer Conflict' :
                                 conflict.type === 'ROOM' ? 'Room Conflict' :
                                 'Student Group Conflict'}
                              </h4>
                              <p className="text-xs text-gray-700 mt-1">
                                {conflict.description}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${conflict.severity === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' :
                                  conflict.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  'bg-blue-100 text-blue-800 border-blue-200'}
                              `}
                            >
                              {conflict.severity}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs">
                            <Button 
                              variant="link" 
                              className="h-auto p-0 text-xs"
                              onClick={() => {
                                setSelectedConflict(conflict);
                                setShowConflictDetails(true);
                              }}
                            >
                              View details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Time Slot Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle>Time Slot Utilization</CardTitle>
                  <CardDescription>Class distribution by time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">By Day</h4>
                      <div className="space-y-2">
                        {stats?.timeSlotUtilization.byDay && 
                          Object.entries(stats.timeSlotUtilization.byDay).map(([day, count]) => {
                            const percentage = (count / classes.length) * 100;
                            
                            return (
                              <div key={day} className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-xs">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                                  <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
                                </div>
                                <Progress value={percentage} className="h-1.5" />
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">By Hour</h4>
                      <div className="space-y-2">
                        {stats?.timeSlotUtilization.byHour && 
                          Object.entries(stats.timeSlotUtilization.byHour).map(([hour, count]) => {
                            const percentage = (count / classes.length) * 100;
                            
                            return (
                              <div key={hour} className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-xs">{hour}</span>
                                  <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
                                </div>
                                <Progress value={percentage} className="h-1.5" />
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Peak Hours</h4>
                      <div className="flex flex-wrap gap-2">
                        {stats?.timeSlotUtilization.peakHours.map(hour => (
                          <Badge key={hour} variant="outline" className="bg-red-50">
                            {hour}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Low Utilization Hours</h4>
                      <div className="flex flex-wrap gap-2">
                        {stats?.timeSlotUtilization.lowUtilizationHours.map(hour => (
                          <Badge key={hour} variant="outline" className="bg-green-50">
                            {hour}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Course Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Distribution</CardTitle>
                  <CardDescription>Courses by department and type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">By Department</h4>
                      <div className="space-y-2">
                        {stats?.courseDistribution.coursesByDepartment && 
                          Object.entries(stats.courseDistribution.coursesByDepartment).map(([deptId, count]) => {
                            const dept = departments.find(d => d.id === deptId);
                            if (!dept) return null;
                            
                            const percentage = (count / stats.courseDistribution.totalCourses) * 100;
                            
                            return (
                              <div key={deptId} className="space-y-1">
                                <div className="flex justify-between">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-2" 
                                      style={{ backgroundColor: dept.color }}
                                    ></div>
                                    <span className="text-xs">{dept.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{count} courses</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full" 
                                    style={{ 
                                      width: `${percentage}%`,
                                      backgroundColor: dept.color
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">By Class Type</h4>
                      <div className="h-[200px] flex items-end justify-around">
                        {['LECTURE', 'LAB', 'TUTORIAL', 'SEMINAR'].map(type => {
                          // Count classes of this type
                          const typeClasses = classes.filter(cls => cls.type === type);
                          const percentage = (typeClasses.length / classes.length) * 100;
                          
                          // Assign a color based on type
                          const color = 
                            type === 'LECTURE' ? '#3b82f6' :
                            type === 'LAB' ? '#ef4444' :
                            type === 'TUTORIAL' ? '#10b981' :
                            '#f59e0b';
                          
                          return (
                            <div key={type} className="flex flex-col items-center">
                              <div 
                                className="w-16 rounded-t" 
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: color
                                }}
                              ></div>
                              <p className="text-xs mt-2">{type.charAt(0) + type.slice(1).toLowerCase()}</p>
                              <p className="text-xs text-gray-500">{typeClasses.length} classes</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Export Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and export reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                        <FileText className="h-8 w-8 mb-2" />
                        <span>Utilization Report</span>
                      </Button>
                      
                      <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <span>Conflict Report</span>
                      </Button>
                      
                      <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                        <Briefcase className="h-8 w-8 mb-2" />
                        <span>Workload Report</span>
                      </Button>
                      
                      <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                        <Building2 className="h-8 w-8 mb-2" />
                        <span>Department Report</span>
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Schedule Completeness</h4>
                      <div className="flex items-center">
                        <Progress value={85} className="h-2 flex-1 mr-4" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        15% of courses still need to be scheduled
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Class Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.resource.course.name}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.resource.course.code} • {selectedEvent.resource.semester} • {selectedEvent.resource.academicYear}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Schedule</Label>
                  <div className="col-span-3">
                    <Badge variant="outline" className="mr-2">
                      {selectedEvent.resource.dayOfWeek.charAt(0) + selectedEvent.resource.dayOfWeek.slice(1).toLowerCase()}
                    </Badge>
                    <span>
                      {selectedEvent.resource.startTime} - {selectedEvent.resource.endTime}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Lecturer</Label>
                  <div className="col-span-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedEvent.resource.lecturer.title} {selectedEvent.resource.lecturer.firstName} {selectedEvent.resource.lecturer.lastName}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Student Group</Label>
                  <div className="col-span-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedEvent.resource.studentGroup.name}
                    <Badge variant="outline" className="ml-2">
                      {selectedEvent.resource.studentGroup.size} students
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Location</Label>
                  <div className="col-span-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedEvent.resource.room.name}, {selectedEvent.resource.room.building}
                    <Badge variant="outline" className="ml-2">
                      Floor {selectedEvent.resource.room.floor}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Department</Label>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: selectedEvent.resource.course.department.color }}
                      ></div>
                      {selectedEvent.resource.course.department.name}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Type</Label>
                  <div className="col-span-3">
                    <Badge variant="outline">
                      {selectedEvent.resource.type.charAt(0) + selectedEvent.resource.type.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>
                
                {selectedEvent.resource.hasConflict && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right text-red-500">Conflict</Label>
                    <div className="col-span-3">
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        {selectedEvent.resource.conflictReason || 'This class has a scheduling conflict.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowEventDetails(false)}>
                  Close
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => {
                    // In a real app, this would open an edit dialog
                    alert(`Edit ${selectedEvent.resource.course.code}`);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Button variant="destructive" onClick={() => handleDeleteClass(selectedEvent.resource.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Class Dialog */}
      <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Schedule a new class in the timetable
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">Course</Label>
              <div className="col-span-3">
                <Select 
                  value={newClass.courseId}
                  onValueChange={(value) => setNewClass({...newClass, courseId: value})}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code}: {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lecturer" className="text-right">Lecturer</Label>
              <div className="col-span-3">
                <Select 
                  value={newClass.lecturerId}
                  onValueChange={(value) => setNewClass({...newClass, lecturerId: value})}
                >
                  <SelectTrigger id="lecturer">
                    <SelectValue placeholder="Select lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map(lecturer => (
                      <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.title} {lecturer.firstName} {lecturer.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentGroup" className="text-right">Student Group</Label>
              <div className="col-span-3">
                <Select 
                  value={newClass.studentGroupId}
                  onValueChange={(value) => setNewClass({...newClass, studentGroupId: value})}
                >
                  <SelectTrigger id="studentGroup">
                    <SelectValue placeholder="Select student group" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.size} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">Room</Label>
              <div className="col-span-3">
                <Select 
                  value={newClass.roomId}
                  onValueChange={(value) => setNewClass({...newClass, roomId: value})}
                >
                  <SelectTrigger id="room">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}, {room.building} (Capacity: {room.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right">Day</Label>
              <div className="col-span-3">
                <Select 
                  value={newClass.dayOfWeek}
                  onValueChange={(value) => setNewClass({...newClass, dayOfWeek: value})}
                >
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONDAY">Monday</SelectItem>
                    <SelectItem value="TUESDAY">Tuesday</SelectItem>
                    <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                    <SelectItem value="THURSDAY">Thursday</SelectItem>
                    <SelectItem value="FRIDAY">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Time</Label>
              <div className="col-span-3 flex space-x-2">
                <Select 
                  value={newClass.startTime}
                  onValueChange={(value) => setNewClass({...newClass, startTime: value})}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
                
                <span className="flex items-center">to</span>
                
                <Select 
                  value={newClass.endTime}
                  onValueChange={(value) => setNewClass({...newClass, endTime: value})}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="12:30">12:30</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="13:30">13:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="16:30">16:30</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="17:30">17:30</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <div className="col-span-3">
                <Select 
                  value={newClass.type}
                  onValueChange={(value) => setNewClass({...newClass, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LECTURE">Lecture</SelectItem>
                    <SelectItem value="LAB">Lab</SelectItem>
                    <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClass(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClass}>
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Import Dialog */}
      <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Import Classes</DialogTitle>
            <DialogDescription>
              Import multiple classes at once using CSV format
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bulkData">CSV Data</Label>
              <textarea
                id="bulkData"
                rows={10}
                className="w-full p-2 border rounded-md"
                placeholder="courseCode,lecturerId,studentGroupId,roomId,dayOfWeek,startTime,endTime,type"
                value={bulkImportData}
                onChange={(e) => setBulkImportData(e.target.value)}
              ></textarea>
              <p className="text-xs text-gray-500">
                Format: courseCode,lecturerId,studentGroupId,roomId,dayOfWeek,startTime,endTime,type
              </p>
            </div>
            
            {bulkImportErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-red-800 mb-1">Import Errors</h4>
                <ul className="text-xs text-red-700 list-disc pl-4 space-y-1">
                  {bulkImportErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex-1">
                <FileDown className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button variant="outline" className="flex-1">
                <FileDown className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkImport(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport}>
              Import Classes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Conflict Details Dialog */}
      <Dialog open={showConflictDetails} onOpenChange={setShowConflictDetails}>
        <DialogContent className="sm:max-w-md">
          {selectedConflict && (
            <>
              <DialogHeader>
                <DialogTitle>Conflict Details</DialogTitle>
                <DialogDescription>
                  {selectedConflict.type === 'LECTURER' ? 'Lecturer Conflict' :
                   selectedConflict.type === 'ROOM' ? 'Room Conflict' :
                   'Student Group Conflict'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className={`p-3 rounded-md ${
                  selectedConflict.severity === 'HIGH' ? 'bg-red-50 border border-red-200' :
                  selectedConflict.severity === 'MEDIUM' ? 'bg-amber-50 border border-amber-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <p className="text-sm">
                    {selectedConflict.description}
                  </p>
                </div>
                
                <h4 className="text-sm font-medium mt-4 mb-2">Conflicting Classes</h4>
                <div className="space-y-3">
                  {selectedConflict.classes.map(cls => (
                    <div key={cls.id} className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{cls.course.code}: {cls.course.name}</div>
                          <div className="text-sm text-gray-500">
                            {cls.dayOfWeek.charAt(0) + cls.dayOfWeek.slice(1).toLowerCase()}, {cls.startTime} - {cls.endTime}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {cls.type.charAt(0) + cls.type.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Lecturer:</span> {cls.lecturer.firstName} {cls.lecturer.lastName}
                        </div>
                        <div>
                          <span className="font-medium">Room:</span> {cls.room.name}
                        </div>
                        <div>
                          <span className="font-medium">Student Group:</span> {cls.studentGroup.name}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {cls.course.department.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-sm font-medium mt-4 mb-2">Suggested Solutions</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm">
                    <div className="font-medium text-green-800">Change Room</div>
                    <p className="text-green-700">
                      Move the second class to Room 203, which is available at the same time.
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm">
                    <div className="font-medium text-green-800">Change Time</div>
                    <p className="text-green-700">
                      Reschedule the first class to Tuesday 14:00-15:30, when the lecturer is available.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowConflictDetails(false)}>
                  Close
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => {
                    // In a real app, this would open an edit dialog for the classes
                    alert('Edit conflicting classes');
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Classes
                  </Button>
                  
                  <Button onClick={() => handleResolveConflict(selectedConflict.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneralTimetable;
