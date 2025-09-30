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
  CreditCard,
  GraduationCap,
  Award
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { getStudentData, mockExams } from '@/lib/mockData';

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
  const studentExams = mockExams.filter(exam => exam.semester === 4); // Current semester
  const upcomingExams = studentExams.filter(exam => exam.status === 'scheduled');
  const completedExams = studentExams.filter(exam => exam.status === 'graded');
  
  // Get dynamic data from student record
  const averageScore = studentData.percentage;
  const currentSemester = studentData.currentSemester;
  const cgpa = studentData.cgpa;

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
                <p className="font-semibold">{user.course || 'Computer Science'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-semibold">{user.year || 2} Year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Status Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6 mb-8">
          <DashboardCard
            title="Admission Status"
            value={studentData.admissionStatus.charAt(0).toUpperCase() + studentData.admissionStatus.slice(1)}
            icon={CheckCircle}
            className={
              studentData.admissionStatus === 'approved'
                ? 'border-green-200 bg-green-50'
                : studentData.admissionStatus === 'pending'
                ? 'border-orange-200 bg-orange-50'
                : 'border-red-200 bg-red-50'
            }
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
          <DashboardCard
            title="Upcoming Exams"
            value={upcomingExams.length}
            icon={GraduationCap}
            description="This semester"
            action={{
              label: "View Schedule",
              onClick: () => router.push('/dashboard/exams')
            }}
          />
          <DashboardCard
            title="Average Score"
            value={`${averageScore.toFixed(1)}%`}
            icon={Award}
            description={`CGPA: ${cgpa.toFixed(2)}`}
            className="border-green-200 bg-green-50/50"
            action={{
              label: "View Results",
              onClick: () => router.push('/dashboard/exams')
            }}
          />
        </div>

        {/* Notifications */}
        {studentData.nextFee ? (
          <Alert className="mb-8">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              <strong>Reminder:</strong> Your {studentData.nextFee.type} fees of ₹{studentData.nextFee.amount.toLocaleString()} are due by {new Date(studentData.nextFee.dueDate).toLocaleDateString()}. 
              <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push('/dashboard/fees')}>
                Pay now
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Great!</strong> You have no pending fee payments at this time.
            </AlertDescription>
          </Alert>
        )}

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
                  <Progress 
                    value={studentData.totalFeesPaid > 0 ? (studentData.totalFeesPaid / (studentData.totalFeesPaid + studentData.pendingFees)) * 100 : 0} 
                    className="h-2" 
                  />
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

          {/* Exam Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Exam Status
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/exams')}>
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Your exam schedule and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upcoming Exams */}
                <div>
                  <h4 className="font-semibold mb-3">Upcoming Exams</h4>
                  <div className="space-y-2">
                    {upcomingExams.length > 0 ? (
                      upcomingExams.slice(0, 2).map((exam) => (
                        <div key={exam.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{exam.subjectName}</p>
                            <p className="text-xs text-muted-foreground">{exam.examType}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No upcoming exams</p>
                    )}
                  </div>
                </div>

                {/* Recent Results */}
                {completedExams.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent Results</h4>
                    <div className="space-y-2">
                      {completedExams.slice(0, 2).map((exam) => (
                        <div key={exam.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{exam.subjectName}</p>
                            <p className="text-xs text-muted-foreground">{exam.examType}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{exam.obtainedMarks}/{exam.maxMarks}</p>
                            <p className="text-xs text-green-600">{exam.grade}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Progress */}
                <div>
                  <h4 className="font-semibold mb-2">Current Semester</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Semester {currentSemester}</span>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <Progress value={((currentSemester % 2) * 50) + 25} className="h-2" />
                    <p className="text-xs text-muted-foreground">{((currentSemester % 2) * 50) + 25}% completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {/* Library Books */}
          <Card>
            <CardHeader>
              <CardTitle>Library Books</CardTitle>
              <CardDescription>Currently issued books</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Hostel Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hostel Information</CardTitle>
              <CardDescription>Your accommodation details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.room && (
                  <div>
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
                            {studentData.room.students.filter(s => s !== studentData.studentName).join(', ') || 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!studentData.room && (
                  <p className="text-sm text-muted-foreground">No room allocated</p>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/exams')}
              >
                <GraduationCap className="h-6 w-6" />
                <span>Exams</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}