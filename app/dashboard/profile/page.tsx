'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, Mail, Phone, Calendar, GraduationCap, Shield, CreditCard as Edit, Save, X, Camera } from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { getStudentData } from '@/lib/mockData';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
    setEditedProfile({
      name: currentUser.name,
      email: currentUser.email,
      phone: '+91 9876543210', // Default phone from mock data
      bio: currentUser.role === 'admin' 
        ? 'Administrator at EFA College. Managing academic operations and student affairs.'
        : `${currentUser.course} student at EFA College. Currently in ${currentUser.year} year.`
    });
  }, [router]);

  if (!user) {
    return null;
  }

  const studentData = user.role === 'student' ? getStudentData(user.studentId || '') : null;

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile in the database
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
    // You could update the user object here if needed
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: user.name,
      email: user.email,
      phone: '+91 9876543210',
      bio: user.role === 'admin' 
        ? 'Administrator at EFA College. Managing academic operations and student affairs.'
        : `${user.course} student at EFA College. Currently in ${user.year} year.`
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="profile" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Picture & Basic Info */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : (
                        <GraduationCap className="h-4 w-4 text-green-600" />
                      )}
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrator' : 'Student'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{editedProfile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : (
                        <GraduationCap className="h-4 w-4 text-green-600" />
                      )}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>

                {user.role === 'student' && (
                  <>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Student ID</Label>
                        <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                          {user.studentId}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Course</Label>
                        <div className="font-medium">{user.course}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <div className="font-medium">{user.year} Year</div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                      {editedProfile.bio}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Information (Students Only) */}
          {user.role === 'student' && studentData && (
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your academic progress and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Current Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Admission Status:</span>
                        <Badge variant={
                          studentData.admissionStatus === 'approved' ? 'default' : 
                          studentData.admissionStatus === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {studentData.admissionStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Semester:</span>
                        <span className="font-medium">Semester {(user.year || 1) * 2}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Fee Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fees Paid:</span>
                        <span className="font-medium text-green-600">₹{studentData.totalFeesPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pending:</span>
                        <span className="font-medium text-red-600">₹{studentData.pendingFees.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Resources</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Books Issued:</span>
                        <span className="font-medium">{studentData.books.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Hostel Room:</span>
                        <span className="font-medium">
                          {studentData.room ? studentData.room.roomNumber : 'Not Allocated'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}