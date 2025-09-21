'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Building2, 
  BookOpen, 
  AlertCircle,
  Bell,
  Calendar,
  User as UserIcon,
  CreditCard
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { getStudentData } from '@/lib/mockData';

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return null;
  }

  const studentData = getStudentData(user.studentId || '');

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="student" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's your academic overview.
          </p>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Student Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-semibold">{user.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="font-semibold">{user.course}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-semibold">{user.year} Year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Status Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardCard
            title="Admission Status"
            value="Approved"
            icon={CheckCircle}
            className="border-green-200 bg-green-50/50"
            action={{
              label: "View Details",
              onClick: () => router.push('/dashboard/admissions')
            }}
          />
          <DashboardCard
            title="Fees Paid"
            value={`₹${(studentData.totalFeesPaid / 1000)}K`}
            icon={DollarSign}
            description={`₹${(studentData.pendingFees / 1000)}K pending`}
            action={{
              label: "Pay Fees",
              onClick: () => router.push('/dashboard/fees')
            }}
          />
          <DashboardCard
            title="Hostel Room"
            value={studentData.room ? studentData.room.roomNumber : 'Not Allocated'}
            icon={Building2}
            description={studentData.room ? `Floor ${studentData.room.floor}` : 'Apply for hostel'}
            action={{
              label: "View Details",
              onClick: () => router.push('/dashboard/hostel')
            }}
          />
          <DashboardCard
            title="Books Issued"
            value={studentData.books.length}
            icon={BookOpen}
            description="From library"
            action={{
              label: "View Library",
              onClick: () => router.push('/dashboard/library')
            }}
          />
        </div>

        {/* Notifications */}
        <Alert className="mb-8">
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <strong>Reminder:</strong> Your hostel fees of ₹15,000 are due by February 15, 2024. 
            <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push('/dashboard/fees')}>
              Pay now
            </Button>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Fee Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Fee Status
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/fees')}>
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Your payment history and pending fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Fees Paid</span>
                    <span>₹{studentData.totalFeesPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Fees</span>
                    <span className="text-red-600">₹{studentData.pendingFees.toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  {studentData.fees.slice(0, 3).map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{fee.type} Fee</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(fee.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{fee.amount.toLocaleString()}</p>
                        <Badge 
                          variant={
                            fee.status === 'paid' ? 'default' : 
                            fee.status === 'overdue' ? 'destructive' : 'secondary'
                          }
                        >
                          {fee.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your course and academic progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Current Semester</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Semester 4</span>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-muted-foreground">60% completed</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Library Books</h4>
                  <div className="space-y-2">
                    {studentData.books.length > 0 ? (
                      studentData.books.map((book) => (
                        <div key={book.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Due: {book.dueDate && new Date(book.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No books currently issued</p>
                    )}
                  </div>
                </div>

                {studentData.room && (
                  <div>
                    <h4 className="font-semibold mb-2">Hostel Information</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Room:</span>
                          <span className="ml-1 font-medium">{studentData.room.roomNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Floor:</span>
                          <span className="ml-1 font-medium">{studentData.room.floor}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Roommates:</span>
                          <span className="ml-1 font-medium">
                            {studentData.room.students.filter(s => s !== 'John Doe').join(', ') || 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/fees')}
              >
                <CreditCard className="h-6 w-6" />
                <span>Pay Fees</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/admissions')}
              >
                <CheckCircle className="h-6 w-6" />
                <span>View Status</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/hostel')}
              >
                <Building2 className="h-6 w-6" />
                <span>Hostel Info</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/library')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Library</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}