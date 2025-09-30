'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Building2, BookOpen, UserPlus, CircleAlert as AlertCircle, TrendingUp, Calendar, Bell, GraduationCap, FileText } from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { 
  mockMetrics, 
  mockAdmissions, 
  mockFees, 
  mockExams, 
  getMonthlyRevenue,
  getTopPerformingStudents,
  getClassAverage 
} from '@/lib/mockData';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return null;
  }

  const recentApplications = mockAdmissions.slice(0, 3);
  const recentPayments = mockFees.filter(fee => fee.status === 'paid').slice(0, 3);
  const upcomingExams = mockExams.filter(exam => exam.status === 'scheduled').slice(0, 3);
  const recentResults = mockExams.filter(exam => exam.status === 'graded').slice(0, 3);
  const monthlyRevenue = getMonthlyRevenue();
  const topStudents = getTopPerformingStudents(3);
  const classAverage = getClassAverage();

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="admin" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's what's happening at your college today.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardCard
            title="Total Students"
            value={mockMetrics.totalStudents.toLocaleString()}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            action={{
              label: "View All",
              onClick: () => router.push('/dashboard/admissions')
            }}
          />
          <DashboardCard
            title="Total Revenue"
            value={`₹${(mockMetrics.totalRevenue / 100000).toFixed(1)}L`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            action={{
              label: "View Fees",
              onClick: () => router.push('/dashboard/fees')
            }}
          />
          <DashboardCard
            title="Hostel Occupancy"
            value={`${mockMetrics.hostelOccupancy}%`}
            icon={Building2}
            trend={{ value: -2, isPositive: false }}
            action={{
              label: "Manage Rooms",
              onClick: () => router.push('/dashboard/hostel')
            }}
          />
          <DashboardCard
            title="Books Issued"
            value={mockMetrics.booksIssued}
            icon={BookOpen}
            trend={{ value: 5, isPositive: true }}
            action={{
              label: "Library Stats",
              onClick: () => router.push('/dashboard/library')
            }}
          />
          <DashboardCard
            title="Upcoming Exams"
            value={mockExams.filter(exam => exam.status === 'scheduled').length}
            icon={GraduationCap}
            trend={{ value: 3, isPositive: true }}
            action={{
              label: "View Schedule",
              onClick: () => router.push('/dashboard/exams')
            }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Admissions</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{mockMetrics.pendingAdmissions}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mockMetrics.overduePayments}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{(monthlyRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">Revenue collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Applications
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/admissions')}>
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Latest admission applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{app.studentName}</p>
                      <p className="text-sm text-muted-foreground">{app.course}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          app.status === 'approved' ? 'default' : 
                          app.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {app.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Payments
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/fees')}>
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Latest fee payments received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{payment.studentName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{payment.type} Fee</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.paidDate && new Date(payment.paidDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Exams
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/exams')}>
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Scheduled examinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{exam.subjectName}</p>
                      <p className="text-sm text-muted-foreground">{exam.subjectCode} • {exam.examType}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {exam.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Top Performers
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/exams')}>
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Highest performing students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Class Average CGPA</p>
                  <p className="text-2xl font-bold text-blue-600">{classAverage.toFixed(2)}</p>
                </div>
                {topStudents.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-sm text-muted-foreground">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{student.cgpa.toFixed(2)} CGPA</p>
                      <p className="text-xs text-muted-foreground">{student.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
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
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/admissions')}
              >
                <UserPlus className="h-6 w-6" />
                <span>Review Admissions</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/fees')}
              >
                <DollarSign className="h-6 w-6" />
                <span>Collect Fees</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/hostel')}
              >
                <Building2 className="h-6 w-6" />
                <span>Allocate Rooms</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/library')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Manage Library</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.push('/dashboard/exams')}
              >
                <GraduationCap className="h-6 w-6" />
                <span>Schedule Exams</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}