'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  Plus, 
  UserPlus,
  Search,
  Bed,
  Wifi,
  Fan,
  Zap
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { mockHostelRooms, HostelRoom, getStudentData } from '@/lib/mockData';



export default function HostelPage() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<HostelRoom[]>(mockHostelRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return null;
  }

  const handleAllocateStudent = (roomId: string, studentName: string) => {
    if (user.role !== 'admin') return;
    
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId && room.occupied < room.capacity
          ? { 
              ...room, 
              students: [...room.students, studentName],
              occupied: room.occupied + 1
            }
          : room
      )
    );
  };

  const handleRemoveStudent = (roomId: string, studentName: string) => {
    if (user.role !== 'admin') return;
    
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId
          ? { 
              ...room, 
              students: room.students.filter(s => s !== studentName),
              occupied: Math.max(0, room.occupied - 1)
            }
          : room
      )
    );
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.students.some(student => student.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesFloor && matchesType;
  });

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.occupied > 0).length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupied = rooms.reduce((sum, room) => sum + room.occupied, 0);
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hostel Management</h1>
          <p className="text-muted-foreground">Manage room allocations and student accommodations</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>Create a new hostel room</DialogDescription>
              </DialogHeader>
              <AddRoomForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Allocate Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Allocate Student to Room</DialogTitle>
                <DialogDescription>Assign a student to an available room</DialogDescription>
              </DialogHeader>
              <AllocateStudentForm rooms={rooms} onAllocate={handleAllocateStudent} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOccupied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <Progress value={occupancyRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                {/* Add ref and useEffect for focus */}
                {(() => {
                  const inputRef = useRef<HTMLInputElement>(null);
                  useEffect(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, [searchTerm]);
                  return (
                    <Input
                      id="search"
                      placeholder="Search by room number or student name..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      ref={inputRef}
                    />
                  );
                })()}
              </div>
            </div>
            <div>
              <Label htmlFor="floor-filter">Floor</Label>
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  <SelectItem value="1">Floor 1</SelectItem>
                  <SelectItem value="2">Floor 2</SelectItem>
                  <SelectItem value="3">Floor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type-filter">Room Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Room {room.roomNumber}
                <Badge variant={room.occupied === 0 ? 'secondary' : room.occupied < room.capacity ? 'default' : 'outline'}>
                  {room.occupied === 0 ? 'Vacant' : room.occupied < room.capacity ? 'Partial' : 'Full'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Floor {room.floor} • {room.type} room • {room.occupied}/{room.capacity} occupied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Amenities</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity === 'AC' && <Zap className="h-3 w-3 mr-1" />}
                        {amenity === 'Fan' && <Fan className="h-3 w-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {room.students.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold">Students</Label>
                    <div className="space-y-2 mt-1">
                      {room.students.map((student, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{student}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveStudent(room.id, student)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Progress value={(room.occupied / room.capacity) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const studentData = getStudentData(user.studentId || '');

  const StudentView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Hostel</h1>
        <p className="text-muted-foreground">View your hostel room information and details</p>
      </div>

      {studentData.room ? (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Room {studentData.room.roomNumber}
              <Badge className="bg-green-100 text-green-800">Allocated</Badge>
            </CardTitle>
            <CardDescription>Floor {studentData.room.floor} • {studentData.room.type} occupancy room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="text-sm font-semibold">Room Details</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Room Number:</span>
                    <span className="text-sm font-medium">{studentData.room.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Floor:</span>
                    <span className="text-sm font-medium">{studentData.room.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capacity:</span>
                    <span className="text-sm font-medium">{studentData.room.capacity} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Currently Occupied:</span>
                    <span className="text-sm font-medium">{studentData.room.occupied} students</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Amenities</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {studentData.room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                      {amenity === 'AC' && <Zap className="h-3 w-3 mr-1" />}
                      {amenity === 'Fan' && <Fan className="h-3 w-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-semibold">Roommates</Label>
                <div className="mt-2">
                  {studentData.room.students.filter(s => s !== studentData.studentName).length > 0 ? (
                    <div className="space-y-2">
                      {studentData.room.students.filter(s => s !== studentData.studentName).map((student, index) => (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{student}</p>
                            <p className="text-xs text-muted-foreground">Roommate</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">You have no roommates currently.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Room Allocated</CardTitle>
            <CardDescription>You haven't been allocated a hostel room yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Please contact the hostel administration for room allocation.
              </p>
              <Button>Contact Administration</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hostel Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Hostel Guidelines</CardTitle>
          <CardDescription>Important rules and regulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-muted-foreground">•</span>
              <span>Maintain cleanliness in your room and common areas</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-muted-foreground">•</span>
              <span>No outside guests allowed after 8 PM</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-muted-foreground">•</span>
              <span>Report any maintenance issues to the warden immediately</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-muted-foreground">•</span>
              <span>Internet usage is monitored and restricted to academic purposes</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-muted-foreground">•</span>
              <span>Hostel fees must be paid by the due date to avoid penalties</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="hostel" />
      <main className="container mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminView /> : <StudentView />}
      </main>
    </div>
  );
}

function AddRoomForm() {
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: '',
    type: '',
    floor: '',
    amenities: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding room:', formData);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="room-number">Room Number</Label>
          <Input
            id="room-number"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            placeholder="101"
            required
          />
        </div>
        <div>
          <Label htmlFor="floor">Floor</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, floor: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, capacity: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Student</SelectItem>
              <SelectItem value="2">2 Students</SelectItem>
              <SelectItem value="3">3 Students</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Room Type</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="triple">Triple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['WiFi', 'AC', 'Fan', 'Study Table', 'Wardrobe', 'Attached Bathroom'].map(amenity => (
            <label key={amenity} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Add Room</Button>
      </div>
    </form>
  );
}

function AllocateStudentForm({ 
  rooms, 
  onAllocate 
}: { 
  rooms: HostelRoom[];
  onAllocate: (roomId: string, studentName: string) => void;
}) {
  const [studentName, setStudentName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const availableRooms = rooms.filter(room => room.occupied < room.capacity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && selectedRoomId) {
      onAllocate(selectedRoomId, studentName);
      setStudentName('');
      setSelectedRoomId('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student-name">Student Name</Label>
        <Input
          id="student-name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          required
        />
      </div>
      <div>
        <Label htmlFor="room">Available Room</Label>
        <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
          <SelectTrigger>
            <SelectValue placeholder="Select available room" />
          </SelectTrigger>
          <SelectContent>
            {availableRooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                Room {room.roomNumber} (Floor {room.floor}) - {room.capacity - room.occupied} spaces available
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Allocate Student</Button>
      </div>
    </form>
  );
}