// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import { 
//   Tabs, 
//   TabsContent, 
//   TabsList, 
//   TabsTrigger 
// } from "@/components/ui/tabs";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from "@/components/ui/dropdown-menu";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogDescription, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger 
// } from "@/components/ui/dialog";
// import { Checkbox } from "@/components/ui/checkbox";
// import { CalendarIcon, Download, Filter, List, MapPin, MoreHorizontal, Printer, RefreshCw, Search, Share2, User } from 'lucide-react';

// // Set up the localizer for the calendar
// const localizer = momentLocalizer(moment);

// // Define types
// interface Course {
//   id: string;
//   code: string;
//   name: string;
//   credits: number;
//   department: string;
//   color: string;
// }

// interface Instructor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   department: string;
// }

// interface Room {
//   id: string;
//   name: string;
//   building: string;
//   floor: number;
//   capacity: number;
// }

// interface ScheduledClass {
//   id: string;
//   course: Course;
//   instructor: Instructor;
//   room: Room;
//   dayOfWeek: string;
//   startTime: string;
//   endTime: string;
//   semester: string;
//   academicYear: string;
// }

// interface CalendarEvent {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
//   resource: ScheduledClass;
// }

// const StudentTimetable = () => {
//   // State
//   const [classes, setClasses] = useState<ScheduledClass[]>([]);
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [view, setView] = useState<'week' | 'day' | 'month' | 'list'>('week');
//   const [currentDate, setCurrentDate] = useState<Date>(new Date());
//   const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
//   const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
//   const [filters, setFilters] = useState({
//     courses: [] as string[],
//     buildings: [] as string[],
//     search: '',
//   });
//   const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
//   const [availableBuildings, setAvailableBuildings] = useState<string[]>([]);
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [studentInfo, setStudentInfo] = useState({
//     id: 'S12345',
//     name: 'John Doe',
//     program: 'Computer Science',
//     year: 3,
//   });

//   // Fetch student's timetable
//   useEffect(() => {
//     const fetchTimetable = async () => {
//       setLoading(true);
//       try {
//         // In a real app, this would be the student's ID from auth
//         const studentId = studentInfo.id;
//         const response = await axios.get(`/api/students/${studentId}/timetable`);
//         setClasses(response.data);
        
//         // Extract unique courses and buildings for filters
//         const courses = [...new Set(response.data.map((cls: ScheduledClass) => cls.course))];
//         const buildings = [...new Set(response.data.map((cls: ScheduledClass) => cls.room.building))];
        
//         setAvailableCourses(courses);
//         setAvailableBuildings(buildings);
        
//         // Convert to calendar events
//         convertToCalendarEvents(response.data);
//       } catch (err) {
//         console.error('Error fetching timetable:', err);
//         setError('Failed to load your timetable. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTimetable();
//   }, []);

//   // Convert scheduled classes to calendar events
//   const convertToCalendarEvents = (classes: ScheduledClass[]) => {
//     const events: CalendarEvent[] = [];
//     const currentDate = new Date();
//     const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
//     // Map day strings to numbers (assuming your dayOfWeek is like "MONDAY")
//     const dayMap: {[key: string]: number} = {
//       'SUNDAY': 0,
//       'MONDAY': 1,
//       'TUESDAY': 2,
//       'WEDNESDAY': 3,
//       'THURSDAY': 4,
//       'FRIDAY': 5,
//       'SATURDAY': 6
//     };

//     classes.forEach(cls => {
//       // Get the day number
//       const classDay = dayMap[cls.dayOfWeek];
      
//       // Calculate the date for this class based on current week
//       const date = new Date(currentDate);
//       const diff = classDay - currentDay;
//       date.setDate(date.getDate() + diff);
      
//       // Parse times
//       const [startHour, startMinute] = cls.startTime.split(':').map(Number);
//       const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      
//       // Create start and end dates
//       const start = new Date(date);
//       start.setHours(startHour, startMinute, 0);
      
//       const end = new Date(date);
//       end.setHours(endHour, endMinute, 0);
      
//       // Create the event
//       events.push({
//         id: cls.id,
//         title: `${cls.course.code}: ${cls.course.name}`,
//         start,
//         end,
//         resource: cls
//       });
//     });
    
//     setEvents(events);
//   };

//   // Apply filters to events
//   const filteredEvents = events.filter(event => {
//     const cls = event.resource;
    
//     // Filter by selected courses
//     if (filters.courses.length > 0 && !filters.courses.includes(cls.course.id)) {
//       return false;
//     }
    
//     // Filter by selected buildings
//     if (filters.buildings.length > 0 && !filters.buildings.includes(cls.room.building)) {
//       return false;
//     }
    
//     // Filter by search term
//     if (filters.search) {
//       const searchTerm = filters.search.toLowerCase();
//       return (
//         cls.course.name.toLowerCase().includes(searchTerm) ||
//         cls.course.code.toLowerCase().includes(searchTerm) ||
//         cls.instructor.lastName.toLowerCase().includes(searchTerm) ||
//         cls.room.name.toLowerCase().includes(searchTerm)
//       );
//     }
    
//     return true;
//   });

//   // Handle event selection
//   const handleSelectEvent = (event: CalendarEvent) => {
//     setSelectedEvent(event);
//     setShowEventDetails(true);
//   };

//   // Handle view change
//   const handleViewChange = (newView: 'week' | 'day' | 'month' | 'list') => {
//     setView(newView);
//   };

//   // Handle date change
//   const handleNavigate = (newDate: Date) => {
//     setCurrentDate(newDate);
//   };

//   // Toggle course filter
//   const toggleCourseFilter = (courseId: string) => {
//     setFilters(prev => {
//       const courses = prev.courses.includes(courseId)
//         ? prev.courses.filter(id => id !== courseId)
//         : [...prev.courses, courseId];
//       return { ...prev, courses };
//     });
//   };

//   // Toggle building filter
//   const toggleBuildingFilter = (building: string) => {
//     setFilters(prev => {
//       const buildings = prev.buildings.includes(building)
//         ? prev.buildings.filter(b => b !== building)
//         : [...prev.buildings, building];
//       return { ...prev, buildings };
//     });
//   };

//   // Handle search
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFilters(prev => ({ ...prev, search: e.target.value }));
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({
//       courses: [],
//       buildings: [],
//       search: '',
//     });
//   };

//   // Export timetable as PDF
//   const exportAsPDF = () => {
//     // In a real app, this would call a PDF generation service
//     alert('Exporting timetable as PDF...');
//     // window.open('/api/students/${studentInfo.id}/timetable/pdf', '_blank');
//   };

//   // Export to calendar
//   const exportToCalendar = () => {
//     // In a real app, this would generate an iCal file
//     alert('Exporting to calendar...');
//     // window.location.href = `/api/students/${studentInfo.id}/timetable/ical`;
//   };

//   // Custom event component for the calendar
//   const EventComponent = ({ event }: { event: CalendarEvent }) => {
//     const cls = event.resource;
//     return (
//       <div 
//         className="rounded p-1 overflow-hidden h-full"
//         style={{ backgroundColor: cls.course.color || '#3b82f6' }}
//       >
//         <div className="text-white font-medium text-xs truncate">
//           {cls.course.code}
//         </div>
//         <div className="text-white text-xs truncate">
//           {cls.room.name}
//         </div>
//       </div>
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-red-500">{error}</div>
//         <Button onClick={() => window.location.reload()} className="ml-4">
//           <RefreshCw className="mr-2 h-4 w-4" /> Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex flex-col space-y-4">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">My Timetable</h1>
//             <p className="text-gray-500">
//               {studentInfo.name} • {studentInfo.program} • Year {studentInfo.year}
//             </p>
//           </div>
          
//           <div className="flex space-x-2">
//             <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
//               <Filter className="mr-2 h-4 w-4" />
//               Filters
//             </Button>
            
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">
//                   <Download className="mr-2 h-4 w-4" />
//                   Export
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={exportAsPDF}>
//                   <Download className="mr-2 h-4 w-4" />
//                   Download PDF
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={exportToCalendar}>
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   Export to Calendar
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => window.print()}>
//                   <Printer className="mr-2 h-4 w-4" />
//                   Print Timetable
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
        
//         {/* Filters Panel */}
//         {showFilters && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Filter Options</CardTitle>
//               <CardDescription>Customize your timetable view</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Search */}
//                 <div>
//                   <Label htmlFor="search">Search</Label>
//                   <div className="relative">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
//                     <Input
//                       id="search"
//                       placeholder="Search courses, rooms, lecturers..."
//                       className="pl-8"
//                       value={filters.search}
//                       onChange={handleSearch}
//                     />
//                   </div>
//                 </div>
                
//                 {/* Course Filter */}
//                 <div>
//                   <Label>Courses</Label>
//                   <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
//                     {availableCourses.map(course => (
//                       <div key={course.id} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={`course-${course.id}`}
//                           checked={filters.courses.includes(course.id)}
//                           onCheckedChange={() => toggleCourseFilter(course.id)}
//                         />
//                         <label
//                           htmlFor={`course-${course.id}`}
//                           className="text-sm cursor-pointer"
//                         >
//                           {course.code}: {course.name}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Building Filter */}
//                 <div>
//                   <Label>Buildings</Label>
//                   <div className="mt-2 space-y-2">
//                     {availableBuildings.map(building => (
//                       <div key={building} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={`building-${building}`}
//                           checked={filters.buildings.includes(building)}
//                           onCheckedChange={() => toggleBuildingFilter(building)}
//                         />
//                         <label
//                           htmlFor={`building-${building}`}
//                           className="text-sm cursor-pointer"
//                         >
//                           {building}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={clearFilters}>
//                 Clear Filters
//               </Button>
//               <Button onClick={() => setShowFilters(false)}>
//                 Apply Filters
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
        
//         {/* View Selector */}
//         <div className="flex justify-between items-center">
//           <Tabs defaultValue="week" onValueChange={(value) => handleViewChange(value as any)}>
//             <TabsList>
//               <TabsTrigger value="day">Day</TabsTrigger>
//               <TabsTrigger value="week">Week</TabsTrigger>
//               <TabsTrigger value="month">Month</TabsTrigger>
//               <TabsTrigger value="list">List</TabsTrigger>
//             </TabsList>
//           </Tabs>
          
//           <div className="text-sm text-gray-500">
//             {filteredEvents.length} classes • {availableCourses.length} courses
//           </div>
//         </div>
        
//         {/* Calendar View */}
//         <div className="h-[600px] bg-white rounded-lg shadow">
//           <Calendar
//             localizer={localizer}
//             events={filteredEvents}
//             startAccessor="start"
//             endAccessor="end"
//             view={view}
//             onView={(newView) => handleViewChange(newView as any)}
//             date={currentDate}
//             onNavigate={handleNavigate}
//             onSelectEvent={handleSelectEvent}
//             components={{
//               event: EventComponent as any,
//             }}
//             formats={{
//               timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),
//               eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
//                 return `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`;
//               },
//             }}
//             min={new Date(0, 0, 0, 8, 0)} // 8:00 AM
//             max={new Date(0, 0, 0, 18, 0)} // 6:00 PM
//           />
//         </div>
        
//         {/* List View (alternative to calendar) */}
//         {view === 'list' && (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecturer</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEvents.sort((a, b) => {
//                   // Sort by day of week first
//                   const dayA = a.start.getDay();
//                   const dayB = b.start.getDay();
//                   if (dayA !== dayB) return dayA - dayB;
                  
//                   // Then by start time
//                   return a.start.getTime() - b.start.getTime();
//                 }).map(event => {
//                   const cls = event.resource;
//                   return (
//                     <tr key={event.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {cls.dayOfWeek.charAt(0) + cls.dayOfWeek.slice(1).toLowerCase()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {cls.startTime} - {cls.endTime}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <div className="font-medium">{cls.course.code}</div>
//                         <div className="text-gray-500">{cls.course.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {cls.instructor.lastName}, {cls.instructor.firstName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <MapPin className="h-4 w-4 mr-1 text-gray-400" />
//                           {cls.room.name}, {cls.room.building}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <Button 
//                           variant="ghost" 
//                           size="sm"
//                           onClick={() => {
//                             setSelectedEvent(event);
//                             setShowEventDetails(true);
//                           }}
//                         >
//                           Details
//                         </Button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {/* Class Details Dialog */}
//       <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
//         <DialogContent className="sm:max-w-md">
//           {selectedEvent && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selectedEvent.resource.course.name}</DialogTitle>
//                 <DialogDescription>
//                   {selectedEvent.resource.course.code} • {selectedEvent.resource.semester} • {selectedEvent.resource.academicYear}
//                 </DialogDescription>
//               </DialogHeader>
              
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label className="text-right">Schedule</Label>
//                   <div className="col-span-3">
//                     <Badge variant="outline" className="mr-2">
//                       {selectedEvent.resource.dayOfWeek.charAt(0) + selectedEvent.resource.dayOfWeek.slice(1).toLowerCase()}
//                     </Badge>
//                     <span>
//                       {selectedEvent.resource.startTime} - {selectedEvent.resource.endTime}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label className="text-right">Lecturer</Label>
//                   <div className="col-span-3 flex items-center">
//                     <User className="h-4 w-4 mr-2 text-gray-500" />
//                     {selectedEvent.resource.instructor.lastName}, {selectedEvent.resource.instructor.firstName}
//                     <Badge variant="outline" className="ml-2">
//                       {selectedEvent.resource.instructor.department}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label className="text-right">Location</Label>
//                   <div className="col-span-3 flex items-center">
//                     <MapPin className="h-4 w-4 mr-2 text-gray-500" />
//                     {selectedEvent.resource.room.name}, {selectedEvent.resource.room.building}
//                     <Badge variant="outline" className="ml-2">
//                       Floor {selectedEvent.resource.room.floor}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label className="text-right">Course</Label>
//                   <div className="col-span-3">
//                     <div>{selectedEvent.resource.course.name}</div>
//                     <div className="text-sm text-gray-500">
//                       {selectedEvent.resource.course.credits} credits • {selectedEvent.resource.course.department}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setShowEventDetails(false)}>
//                   Close
//                 </Button>
                
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline">
//                       <MoreHorizontal className="h-4 w-4 mr-2" />
//                       Options
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent>
//                     <DropdownMenuItem onClick={() => {
//                       // In a real app, this would open a map view
//                       alert(`Show directions to ${selectedEvent.resource.room.building}`);
//                     }}>
//                       <MapPin className="h-4 w-4 mr-2" />
//                       Get Directions
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => {
//                       // In a real app, this would add to calendar
//                       alert(`Add ${selectedEvent.resource.course.name} to calendar`);
//                     }}>
//                       <CalendarIcon className="h-4 w-4 mr-2" />
//                       Add to Calendar
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => {
//                       // In a real app, this would share the class
//                       alert(`Share ${selectedEvent.resource.course.name}`);
//                     }}>
//                       <Share2 className="h-4 w-4 mr-2" />
//                       Share
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default StudentTimetable;
