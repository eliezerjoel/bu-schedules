'use client';

import React, { useState, useEffect } from 'react';
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
import { CalendarIcon, Clock, Download, Edit, FileText, Filter, List, MapPin, MoreHorizontal, Plus, Printer, RefreshCw, Search, Share2, User, Users, BookOpen, BarChart, AlertCircle, CheckCircle, XCircle, CalendarPlus2Icon as CalendarIcon2, ClockIcon } from 'lucide-react';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Define types
interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  color: string;
}

interface StudentGroup {
  id: string;
  name: string;
  program: string;
  year: number;
  size: number;
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
}

interface ScheduledClass {
  id: string;
  course: Course;
  studentGroup: StudentGroup;
  room: Room;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  semester: string;
  academicYear: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR';
}

interface OfficeHour {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  isBooked: boolean;
  studentName?: string;
  purpose?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ScheduledClass | OfficeHour;
  isClass: boolean;
}

interface LecturerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  officeLocation: string;
  phoneNumber: string;
  currentWorkload: number;
  maxWorkload: number;
}

const LecturerTimetable = () => {
  // State
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [officeHours, setOfficeHours] = useState<OfficeHour[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'week' | 'day' | 'month' | 'agenda'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [showAddOfficeHour, setShowAddOfficeHour] = useState<boolean>(false);
  const [showChangeRequest, setShowChangeRequest] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    courses: [] as string[],
    classTypes: [] as string[],
    studentGroups: [] as string[],
    search: '',
  });
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableStudentGroups, setAvailableStudentGroups] = useState<StudentGroup[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'office-hours' | 'workload'>('schedule');
  const [lecturerInfo, setLecturerInfo] = useState<LecturerInfo>({
    id: 'L12345',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    department: 'Computer Science',
    title: 'Associate Professor',
    officeLocation: 'Science Building, Room 305',
    phoneNumber: '(123) 456-7890',
    currentWorkload: 12,
    maxWorkload: 18,
  });
  const [newOfficeHour, setNewOfficeHour] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '10:00',
    endTime: '11:00',
    location: lecturerInfo.officeLocation,
  });
  const [changeRequest, setChangeRequest] = useState({
    classId: '',
    reason: '',
    preferredDay: '',
    preferredStartTime: '',
    preferredEndTime: '',
    preferredRoom: '',
  });

  // Fetch lecturer's timetable
  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        // In a real app, this would be the lecturer's ID from auth
        const lecturerId = lecturerInfo.id;
        
        // Fetch teaching schedule
        const classesResponse = await axios.get(`/api/lecturers/${lecturerId}/classes`);
        setClasses(classesResponse.data);
        
        // Fetch office hours
        const officeHoursResponse = await axios.get(`/api/lecturers/${lecturerId}/office-hours`);
        setOfficeHours(officeHoursResponse.data);
        
        // Extract unique courses and student groups for filters
        const courses = [...new Set(classesResponse.data.map((cls: ScheduledClass) => cls.course))];
        const studentGroups = [...new Set(classesResponse.data.map((cls: ScheduledClass) => cls.studentGroup))];
        
        setAvailableCourses(courses);
        setAvailableStudentGroups(studentGroups);
        
        // Convert to calendar events
        convertToCalendarEvents(classesResponse.data, officeHoursResponse.data);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError('Failed to load your timetable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Convert scheduled classes and office hours to calendar events
  const convertToCalendarEvents = (classes: ScheduledClass[], officeHours: OfficeHour[]) => {
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
        title: `${cls.course.code}: ${cls.course.name} (${cls.studentGroup.name})`,
        start,
        end,
        resource: cls,
        isClass: true
      });
    });
    
    // Process office hours
    officeHours.forEach(oh => {
      const ohDay = dayMap[oh.dayOfWeek];
      
      // Calculate the date for this office hour based on current week
      const date = new Date(currentDate);
      const diff = ohDay - currentDay;
      date.setDate(date.getDate() + diff);
      
      // Parse times
      const [startHour, startMinute] = oh.startTime.split(':').map(Number);
      const [endHour, endMinute] = oh.endTime.split(':').map(Number);
      
      // Create start and end dates
      const start = new Date(date);
      start.setHours(startHour, startMinute, 0);
      
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0);
      
      // Create the event
      events.push({
        id: oh.id,
        title: `Office Hours${oh.isBooked ? ' (Booked)' : ''}`,
        start,
        end,
        resource: oh,
        isClass: false
      });
    });
    
    setEvents(events);
  };

  // Apply filters to events
  const filteredEvents = events.filter(event => {
    // Only filter class events, not office hours
    if (!event.isClass) {
      return activeTab === 'office-hours' || activeTab === 'schedule';
    }
    
    if (activeTab === 'office-hours') {
      return false;
    }
    
    const cls = event.resource as ScheduledClass;
    
    // Filter by selected courses
    if (filters.courses.length > 0 && !filters.courses.includes(cls.course.id)) {
      return false;
    }
    
    // Filter by selected class types
    if (filters.classTypes.length > 0 && !filters.classTypes.includes(cls.type)) {
      return false;
    }
    
    // Filter by selected student groups
    if (filters.studentGroups.length > 0 && !filters.studentGroups.includes(cls.studentGroup.id)) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        cls.course.name.toLowerCase().includes(searchTerm) ||
        cls.course.code.toLowerCase().includes(searchTerm) ||
        cls.studentGroup.name.toLowerCase().includes(searchTerm) ||
        cls.room.name.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });

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

  // Toggle course filter
  const toggleCourseFilter = (courseId: string) => {
    setFilters(prev => {
      const courses = prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId];
      return { ...prev, courses };
    });
  };

  // Toggle class type filter
  const toggleClassTypeFilter = (type: string) => {
    setFilters(prev => {
      const classTypes = prev.classTypes.includes(type)
        ? prev.classTypes.filter(t => t !== type)
        : [...prev.classTypes, type];
      return { ...prev, classTypes };
    });
  };

  // Toggle student group filter
  const toggleStudentGroupFilter = (groupId: string) => {
    setFilters(prev => {
      const studentGroups = prev.studentGroups.includes(groupId)
        ? prev.studentGroups.filter(id => id !== groupId)
        : [...prev.studentGroups, groupId];
      return { ...prev, studentGroups };
    });
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      courses: [],
      classTypes: [],
      studentGroups: [],
      search: '',
    });
  };

  // Add new office hour
  const handleAddOfficeHour = async () => {
    try {
      // In a real app, this would call your API
      const response = await axios.post(`/api/lecturers/${lecturerInfo.id}/office-hours`, newOfficeHour);
      
      // Add the new office hour to state
      const newOH = response.data;
      setOfficeHours([...officeHours, newOH]);
      
      // Update calendar events
      convertToCalendarEvents(classes, [...officeHours, newOH]);
      
      // Close the dialog
      setShowAddOfficeHour(false);
      
      // Reset form
      setNewOfficeHour({
        dayOfWeek: 'MONDAY',
        startTime: '10:00',
        endTime: '11:00',
        location: lecturerInfo.officeLocation,
      });
    } catch (err) {
      console.error('Error adding office hour:', err);
      alert('Failed to add office hour. Please try again.');
    }
  };

  // Submit change request
  const handleSubmitChangeRequest = async () => {
    try {
      // In a real app, this would call your API
      await axios.post(`/api/schedule-changes/request`, changeRequest);
      
      // Close the dialog
      setShowChangeRequest(false);
      
      // Reset form
      setChangeRequest({
        classId: '',
        reason: '',
        preferredDay: '',
        preferredStartTime: '',
        preferredEndTime: '',
        preferredRoom: '',
      });
      
      // Show success message
      alert('Change request submitted successfully!');
    } catch (err) {
      console.error('Error submitting change request:', err);
      alert('Failed to submit change request. Please try again.');
    }
  };

  // Export timetable as PDF
  const exportAsPDF = () => {
    // In a real app, this would call a PDF generation service
    alert('Exporting timetable as PDF...');
    // window.open(`/api/lecturers/${lecturerInfo.id}/timetable/pdf`, '_blank');
  };

  // Export to calendar
  const exportToCalendar = () => {
    // In a real app, this would generate an iCal file
    alert('Exporting to calendar...');
    // window.location.href = `/api/lecturers/${lecturerInfo.id}/timetable/ical`;
  };

  // Custom event component for the calendar
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    if (event.isClass) {
      const cls = event.resource as ScheduledClass;
      return (
        <div 
          className="rounded p-1 overflow-hidden h-full"
          style={{ backgroundColor: cls.course.color || '#3b82f6' }}
        >
          <div className="text-white font-medium text-xs truncate">
            {cls.course.code}
          </div>
          <div className="text-white text-xs truncate">
            {cls.room.name} | {cls.studentGroup.name}
          </div>
        </div>
      );
    } else {
      const oh = event.resource as OfficeHour;
      return (
        <div 
          className={`rounded p-1 overflow-hidden h-full ${
            oh.isBooked ? 'bg-amber-500' : 'bg-green-500'
          }`}
        >
          <div className="text-white font-medium text-xs truncate">
            Office Hours
          </div>
          <div className="text-white text-xs truncate">
            {oh.isBooked ? `Booked: ${oh.studentName}` : 'Available'}
          </div>
        </div>
      );
    }
  };

  // Calculate workload statistics
  const calculateWorkloadStats = () => {
    // Total hours per week
    const totalHours = classes.reduce((total, cls) => {
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      const durationInHours = (endTimeInMinutes - startTimeInMinutes) / 60;
      return total + durationInHours;
    }, 0);
    
    // Hours by course
    const hoursByCourse: {[key: string]: number} = {};
    classes.forEach(cls => {
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      const durationInHours = (endTimeInMinutes - startTimeInMinutes) / 60;
      
      if (!hoursByCourse[cls.course.id]) {
        hoursByCourse[cls.course.id] = 0;
      }
      
      hoursByCourse[cls.course.id] += durationInHours;
    });
    
    // Hours by day
    const hoursByDay: {[key: string]: number} = {
      'MONDAY': 0,
      'TUESDAY': 0,
      'WEDNESDAY': 0,
      'THURSDAY': 0,
      'FRIDAY': 0,
    };
    
    classes.forEach(cls => {
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      const durationInHours = (endTimeInMinutes - startTimeInMinutes) / 60;
      
      hoursByDay[cls.dayOfWeek] += durationInHours;
    });
    
    return {
      totalHours,
      hoursByCourse,
      hoursByDay,
      workloadPercentage: (totalHours / lecturerInfo.maxWorkload) * 100,
    };
  };

  const workloadStats = calculateWorkloadStats();

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
            <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
            <p className="text-gray-500">
              {lecturerInfo.title} {lecturerInfo.firstName} {lecturerInfo.lastName} • {lecturerInfo.department}
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
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCalendar}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Export to Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Timetable
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Workload Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Clock className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Workload</p>
                  <p className="text-2xl font-bold">{workloadStats.totalHours.toFixed(1)} hrs/week</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{workloadStats.totalHours.toFixed(1)} hrs</span>
                  <span className="text-sm">{lecturerInfo.maxWorkload} hrs</span>
                </div>
                <Progress value={workloadStats.workloadPercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {workloadStats.workloadPercentage.toFixed(0)}% of maximum teaching load
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('workload')}>
                  <BarChart className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                      placeholder="Search courses, rooms, student groups..."
                      className="pl-8"
                      value={filters.search}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                
                {/* Course Filter */}
                <div>
                  <Label>Courses</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {availableCourses.map(course => (
                      <div key={course.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={filters.courses.includes(course.id)}
                          onCheckedChange={() => toggleCourseFilter(course.id)}
                        />
                        <label
                          htmlFor={`course-${course.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {course.code}: {course.name}
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
                          onCheckedChange={() => toggleClassTypeFilter(type)}
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
              </div>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Teaching Schedule</TabsTrigger>
            <TabsTrigger value="office-hours">Office Hours</TabsTrigger>
            <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
          </TabsList>
          
          {/* Teaching Schedule Tab */}
          <TabsContent value="schedule">
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
                {classes.length} classes • {availableCourses.length} courses
              </div>
            </div>
            
            {/* Calendar View */}
            <Card>
              <CardContent className="p-0 overflow-hidden">
                <div className="h-[600px]">
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents.filter(e => e.isClass)}
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
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your next scheduled classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Student Group</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes
                      .sort((a, b) => {
                        // Sort by day of week first
                        const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
                        const dayA = dayOrder.indexOf(a.dayOfWeek);
                        const dayB = dayOrder.indexOf(b.dayOfWeek);
                        if (dayA !== dayB) return dayA - dayB;
                        
                        // Then by start time
                        return a.startTime.localeCompare(b.startTime);
                      })
                      .slice(0, 5) // Show only the next 5 classes
                      .map(cls => (
                        <TableRow key={cls.id}>
                          <TableCell>{cls.dayOfWeek.charAt(0) + cls.dayOfWeek.slice(1).toLowerCase()}</TableCell>
                          <TableCell>{cls.startTime} - {cls.endTime}</TableCell>
                          <TableCell>
                            <div className="font-medium">{cls.course.code}</div>
                            <div className="text-sm text-gray-500">{cls.course.name}</div>
                          </TableCell>
                          <TableCell>{cls.studentGroup.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {cls.room.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => {
                                  // Find the event for this class
                                  const event = events.find(e => e.isClass && e.resource.id === cls.id);
                                  if (event) {
                                    setSelectedEvent(event);
                                    setShowEventDetails(true);
                                  }
                                }}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setChangeRequest({
                                    ...changeRequest,
                                    classId: cls.id,
                                    preferredDay: cls.dayOfWeek,
                                    preferredStartTime: cls.startTime,
                                    preferredEndTime: cls.endTime,
                                    preferredRoom: cls.room.id,
                                  });
                                  setShowChangeRequest(true);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Request Change
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // In a real app, this would navigate to the class roster
                                  alert(`View roster for ${cls.course.code}`);
                                }}>
                                  <Users className="h-4 w-4 mr-2" />
                                  View Roster
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Classes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Office Hours Tab */}
          <TabsContent value="office-hours">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Office Hours</CardTitle>
                    <CardDescription>Manage your availability for student consultations</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddOfficeHour(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Office Hour
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar View for Office Hours */}
                <div className="h-[400px] mb-6">
                  <Calendar
                    localizer={localizer}
                    events={events.filter(e => !e.isClass)} // Only show office hours
                    startAccessor="start"
                    endAccessor="end"
                    view="week"
                    date={currentDate}
                    onNavigate={handleNavigate}
                    onSelectEvent={handleSelectEvent}
                    components={{
                      event: EventComponent as any,
                    }}
                    min={new Date(0, 0, 0, 8, 0)} // 8:00 AM
                    max={new Date(0, 0, 0, 18, 0)} // 6:00 PM
                  />
                </div>
                
                {/* Office Hours List */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officeHours
                      .sort((a, b) => {
                        // Sort by day of week first
                        const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
                        const dayA = dayOrder.indexOf(a.dayOfWeek);
                        const dayB = dayOrder.indexOf(b.dayOfWeek);
                        if (dayA !== dayB) return dayA - dayB;
                        
                        // Then by start time
                        return a.startTime.localeCompare(b.startTime);
                      })
                      .map(oh => (
                        <TableRow key={oh.id}>
                          <TableCell>{oh.dayOfWeek.charAt(0) + oh.dayOfWeek.slice(1).toLowerCase()}</TableCell>
                          <TableCell>{oh.startTime} - {oh.endTime}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {oh.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            {oh.isBooked ? (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                Booked
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {oh.isBooked && (
                                  <DropdownMenuItem onClick={() => {
                                    // In a real app, this would show appointment details
                                    alert(`Appointment with ${oh.studentName} for ${oh.purpose}`);
                                  }}>
                                    <User className="h-4 w-4 mr-2" />
                                    View Appointment
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => {
                                  // In a real app, this would open an edit dialog
                                  alert(`Edit office hour on ${oh.dayOfWeek}`);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // In a real app, this would open a confirmation dialog
                                  if (confirm('Are you sure you want to delete this office hour?')) {
                                    // Delete logic
                                    alert('Office hour deleted');
                                  }
                                }}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Workload Analysis Tab */}
          <TabsContent value="workload">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Workload */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Workload</CardTitle>
                  <CardDescription>Semester: Fall 2023/2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Teaching Load</span>
                        <span className="text-sm font-medium">{workloadStats.totalHours.toFixed(1)}/{lecturerInfo.maxWorkload} hrs</span>
                      </div>
                      <Progress value={workloadStats.workloadPercentage} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Distribution by Course</h4>
                      {Object.entries(workloadStats.hoursByCourse).map(([courseId, hours]) => {
                        const course = availableCourses.find(c => c.id === courseId);
                        if (!course) return null;
                        
                        const percentage = (hours / workloadStats.totalHours) * 100;
                        
                        return (
                          <div key={courseId} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs">{course.code}: {course.name}</span>
                              <span className="text-xs">{hours.toFixed(1)} hrs ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: course.color || '#3b82f6'
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Distribution by Day</h4>
                      {Object.entries(workloadStats.hoursByDay).map(([day, hours]) => {
                        const percentage = (hours / workloadStats.totalHours) * 100;
                        
                        return (
                          <div key={day} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                              <span className="text-xs">{hours.toFixed(1)} hrs ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Teaching Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Summary</CardTitle>
                  <CardDescription>Current semester statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{classes.length}</div>
                      <div className="text-sm text-gray-500">Total Classes</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{availableCourses.length}</div>
                      <div className="text-sm text-gray-500">Courses</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-amber-600">{availableStudentGroups.length}</div>
                      <div className="text-sm text-gray-500">Student Groups</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{officeHours.length}</div>
                      <div className="text-sm text-gray-500">Office Hours</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Student Distribution</h4>
                    <div className="space-y-2">
                      {availableStudentGroups.map(group => {
                        const groupClasses = classes.filter(cls => cls.studentGroup.id === group.id);
                        
                        return (
                          <div key={group.id} className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">{group.name}</div>
                              <div className="text-xs text-gray-500">{group.program}, Year {group.year}</div>
                            </div>
                            <Badge variant="outline">
                              {groupClasses.length} classes
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Room Utilization</h4>
                    <div className="space-y-2">
                      {Array.from(new Set(classes.map(cls => cls.room.id))).map(roomId => {
                        const room = classes.find(cls => cls.room.id === roomId)?.room;
                        if (!room) return null;
                        
                        const roomClasses = classes.filter(cls => cls.room.id === roomId);
                        
                        return (
                          <div key={roomId} className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">{room.name}</div>
                              <div className="text-xs text-gray-500">{room.building}, Floor {room.floor}</div>
                            </div>
                            <Badge variant="outline">
                              {roomClasses.length} classes
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Historical Workload */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Historical Workload</CardTitle>
                <CardDescription>Compare your teaching load across semesters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {/* In a real app, this would be a chart component */}
                  <div className="flex h-full items-end justify-around">
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
                      <p className="text-xs mt-2">Fall 2022</p>
                      <p className="text-xs text-gray-500">8.0 hrs</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                      <p className="text-xs mt-2">Spring 2023</p>
                      <p className="text-xs text-gray-500">12.0 hrs</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-500 rounded-t" style={{ height: '50%' }}></div>
                      <p className="text-xs mt-2">Summer 2023</p>
                      <p className="text-xs text-gray-500">10.0 hrs</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-blue-700 rounded-t" style={{ height: '65%' }}></div>
                      <p className="text-xs mt-2 font-bold">Fall 2023</p>
                      <p className="text-xs text-gray-500">{workloadStats.totalHours.toFixed(1)} hrs</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 bg-gray-300 rounded-t" style={{ height: '45%' }}></div>
                      <p className="text-xs mt-2">Spring 2024</p>
                      <p className="text-xs text-gray-500">Projected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Class Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-md">
          {selectedEvent && selectedEvent.isClass && (
            <>
              <DialogHeader>
                <DialogTitle>{(selectedEvent.resource as ScheduledClass).course.name}</DialogTitle>
                <DialogDescription>
                  {(selectedEvent.resource as ScheduledClass).course.code} • {(selectedEvent.resource as ScheduledClass).semester} • {(selectedEvent.resource as ScheduledClass).academicYear}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Schedule</Label>
                  <div className="col-span-3">
                    <Badge variant="outline" className="mr-2">
                      {(selectedEvent.resource as ScheduledClass).dayOfWeek.charAt(0) + (selectedEvent.resource as ScheduledClass).dayOfWeek.slice(1).toLowerCase()}
                    </Badge>
                    <span>
                      {(selectedEvent.resource as ScheduledClass).startTime} - {(selectedEvent.resource as ScheduledClass).endTime}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Student Group</Label>
                  <div className="col-span-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    {(selectedEvent.resource as ScheduledClass).studentGroup.name}
                    <Badge variant="outline" className="ml-2">
                      {(selectedEvent.resource as ScheduledClass).studentGroup.size} students
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Location</Label>
                  <div className="col-span-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {(selectedEvent.resource as ScheduledClass).room.name}, {(selectedEvent.resource as ScheduledClass).room.building}
                    <Badge variant="outline" className="ml-2">
                      Floor {(selectedEvent.resource as ScheduledClass).room.floor}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Course</Label>
                  <div className="col-span-3">
                    <div>{(selectedEvent.resource as ScheduledClass).course.name}</div>
                    <div className="text-sm text-gray-500">
                      {(selectedEvent.resource as ScheduledClass).course.credits} credits • {(selectedEvent.resource as ScheduledClass).course.department}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Resources</Label>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2">
                      {(selectedEvent.resource as ScheduledClass).room.hasProjector && (
                        <Badge variant="outline">Projector</Badge>
                      )}
                      {(selectedEvent.resource as ScheduledClass).room.hasComputers && (
                        <Badge variant="outline">Computers</Badge>
                      )}
                      <Badge variant="outline">Capacity: {(selectedEvent.resource as ScheduledClass).room.capacity}</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowEventDetails(false)}>
                  Close
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => {
                    // In a real app, this would navigate to the class roster
                    alert(`View roster for ${(selectedEvent.resource as ScheduledClass).course.code}`);
                  }}>
                    <Users className="h-4 w-4 mr-2" />
                    Roster
                  </Button>
                  
                  <Button onClick={() => {
                    setChangeRequest({
                      classId: (selectedEvent.resource as ScheduledClass).id,
                      reason: '',
                      preferredDay: (selectedEvent.resource as ScheduledClass).dayOfWeek,
                      preferredStartTime: (selectedEvent.resource as ScheduledClass).startTime,
                      preferredEndTime: (selectedEvent.resource as ScheduledClass).endTime,
                      preferredRoom: (selectedEvent.resource as ScheduledClass).room.id,
                    });
                    setShowEventDetails(false);
                    setShowChangeRequest(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Request Change
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {selectedEvent && !selectedEvent.isClass && (
            <>
              <DialogHeader>
                <DialogTitle>Office Hours</DialogTitle>
                <DialogDescription>
                  {(selectedEvent.resource as OfficeHour).dayOfWeek.charAt(0) + (selectedEvent.resource as OfficeHour).dayOfWeek.slice(1).toLowerCase()}, {(selectedEvent.resource as OfficeHour).startTime} - {(selectedEvent.resource as OfficeHour).endTime}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Location</Label>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {(selectedEvent.resource as OfficeHour).location}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3">
                    {(selectedEvent.resource as OfficeHour).isBooked ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Booked
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>
                
                {(selectedEvent.resource as OfficeHour).isBooked && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Student</Label>
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          {(selectedEvent.resource as OfficeHour).studentName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Purpose</Label>
                      <div className="col-span-3">
                        {(selectedEvent.resource as OfficeHour).purpose}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowEventDetails(false)}>
                  Close
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => {
                    // In a real app, this would open an edit dialog
                    alert('Edit office hour');
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Button variant="destructive" onClick={() => {
                    // In a real app, this would delete the office hour
                    if (confirm('Are you sure you want to delete this office hour?')) {
                      alert('Office hour deleted');
                      setShowEventDetails(false);
                    }
                  }}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Office Hour Dialog */}
      <Dialog open={showAddOfficeHour} onOpenChange={setShowAddOfficeHour}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Office Hour</DialogTitle>
            <DialogDescription>
              Set up a new office hour for student consultations
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="day" className="text-right">Day</Label>
              <Select 
                value={newOfficeHour.dayOfWeek}
                onValueChange={(value) => setNewOfficeHour({...newOfficeHour, dayOfWeek: value})}
              >
                <SelectTrigger className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">Start Time</Label>
              <Select 
                value={newOfficeHour.startTime}
                onValueChange={(value) => setNewOfficeHour({...newOfficeHour, startTime: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select start time" />
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
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">End Time</Label>
              <Select 
                value={newOfficeHour.endTime}
                onValueChange={(value) => setNewOfficeHour({...newOfficeHour, endTime: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                value={newOfficeHour.location}
                onChange={(e) => setNewOfficeHour({...newOfficeHour, location: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOfficeHour(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOfficeHour}>
              Add Office Hour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Change Request Dialog */}
      <Dialog open={showChangeRequest} onOpenChange={setShowChangeRequest}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Schedule Change</DialogTitle>
            <DialogDescription>
              Submit a request to change your class schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Reason</Label>
              <div className="col-span-3">
                <Select 
                  value={changeRequest.reason}
                  onValueChange={(value) => setChangeRequest({...changeRequest, reason: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conflict">Schedule Conflict</SelectItem>
                    <SelectItem value="personal">Personal Reasons</SelectItem>
                    <SelectItem value="room">Room Issue</SelectItem>
                    <SelectItem value="resources">Resource Needs</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preferredDay" className="text-right">Preferred Day</Label>
              <div className="col-span-3">
                <Select 
                  value={changeRequest.preferredDay}
                  onValueChange={(value) => setChangeRequest({...changeRequest, preferredDay: value})}
                >
                  <SelectTrigger>
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
              <Label htmlFor="preferredTime" className="text-right">Preferred Time</Label>
              <div className="col-span-3 flex space-x-2">
                <Select 
                  value={changeRequest.preferredStartTime}
                  onValueChange={(value) => setChangeRequest({...changeRequest, preferredStartTime: value})}
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
                  value={changeRequest.preferredEndTime}
                  onValueChange={(value) => setChangeRequest({...changeRequest, preferredEndTime: value})}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="comments" className="text-right pt-2">Comments</Label>
              <textarea
                id="comments"
                rows={3}
                placeholder="Additional details about your request..."
                className="col-span-3 p-2 border rounded-md"
              ></textarea>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full">Submit Request</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Schedule Change Request</AlertDialogTitle>
                <AlertDialogDescription>
                  This will submit a request to change your class schedule. The request will be reviewed by the administration.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitChangeRequest}>
                  Submit Request
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerTimetable;
