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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  AlertCircle,
  Calendar,
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { mockAdmissions, AdmissionApplication } from '@/lib/mockData';

export default function AdmissionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<AdmissionApplication[]>(mockAdmissions);
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [studentApplication, setStudentApplication] = useState<AdmissionApplication | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
    
    // Find the current user's application
    const userApplication = mockAdmissions.find(app => app.email === currentUser.email);
    setStudentApplication(userApplication || null);
  }, [router]);

  if (!user) {
    return null;
  }

  const handleStatusChange = (applicationId: string, newStatus: 'approved' | 'rejected', remarks?: string) => {
    if (user.role !== 'admin') return;
    
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: newStatus,
              reviewDate: new Date().toISOString().split('T')[0],
              reviewRemarks: remarks
            }
          : app
      )
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'under_review':
        return <Eye className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'under_review':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-orange-50 border-orange-200 text-orange-800';
    }
  };

  const AdminView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admissions Management</h1>
          <p className="text-muted-foreground">Review and manage student admission applications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Applications
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {applications.filter(app => app.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(app => app.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Applications</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or course..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Review and manage student admission applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.studentName}</p>
                      <p className="text-sm text-muted-foreground">{application.email}</p>
                      <p className="text-sm text-muted-foreground">{application.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{application.course}</Badge>
                  </TableCell>
                  <TableCell>{new Date(application.applicationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.documents.length} docs</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <Badge 
                        variant={
                          application.status === 'approved' ? 'default' : 
                          application.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {application.status === 'under_review' ? 'Under Review' : application.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Application Review</DialogTitle>
                            <DialogDescription>{application.studentName}'s admission application</DialogDescription>
                          </DialogHeader>
                          <ApplicationReview 
                            application={application} 
                            onStatusChange={handleStatusChange}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const StudentView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Admission Application</h1>
        <p className="text-muted-foreground">Track your admission application status and submit required documents</p>
      </div>

      {studentApplication ? (
        <div className="space-y-6">
          {/* Application Status Card */}
          <Card className={`${getStatusColor(studentApplication.status)} border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(studentApplication.status)}
                  <span>Application Status</span>
                </div>
                <Badge 
                  variant={
                    studentApplication.status === 'approved' ? 'default' : 
                    studentApplication.status === 'rejected' ? 'destructive' : 'secondary'
                  }
                  className="text-lg px-4 py-2"
                >
                  {studentApplication.status === 'under_review' ? 'Under Review' : 
                   studentApplication.status.charAt(0).toUpperCase() + studentApplication.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentApplication.status === 'approved' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Congratulations!</strong> Your admission has been approved. Please proceed with fee payment and document verification.
                    </AlertDescription>
                  </Alert>
                )}
                
                {studentApplication.status === 'rejected' && (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Application Rejected.</strong> {studentApplication.reviewRemarks || 'Please contact admissions office for more details.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                {studentApplication.status === 'pending' && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Under Review.</strong> Your application is being reviewed by the admissions committee. You will be notified once a decision is made.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-semibold">Application ID</Label>
                    <p className="font-mono text-sm">APP-{studentApplication.id.padStart(6, '0')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Submitted On</Label>
                    <p>{new Date(studentApplication.applicationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Course Applied</Label>
                    <p>{studentApplication.course}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Apply for Admission</CardTitle>
            <CardDescription>Select your preferred course to apply for admission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't applied for admission yet. Select your course to apply.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply for Admission</DialogTitle>
                    <DialogDescription>Select your preferred course</DialogDescription>
                  </DialogHeader>
                  <NewApplicationForm onSubmit={(data) => {
                    // Create new application
                    const newApplication: AdmissionApplication = {
                      id: (applications.length + 1).toString(),
                      studentName: user.name,
                      email: user.email,
                      phone: '+91 9876543210', // Default phone
                      course: data.course,
                      status: 'pending',
                      applicationDate: new Date().toISOString().split('T')[0],
                      documents: [],
                      feesPaid: false
                    };
                    setApplications(prev => [...prev, newApplication]);
                  }} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="admissions" />
      <main className="container mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminView /> : <StudentView />}
      </main>
    </div>
  );
}

function ApplicationReview({ 
  application, 
  onStatusChange 
}: { 
  application: AdmissionApplication;
  onStatusChange: (id: string, status: 'approved' | 'rejected', remarks?: string) => void;
}) {
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmitReview = () => {
    if (selectedAction) {
      const status = selectedAction === 'approve' ? 'approved' : 'rejected';
      onStatusChange(application.id, status, reviewRemarks);
      setSelectedAction(null);
      setReviewRemarks('');
    }
  };


  return (
    <div className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Application Details</TabsTrigger>
          <TabsTrigger value="review">Review & Decision</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <ApplicationDetails application={application} isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="review" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="remarks">Review Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Add your review comments here..."
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            {application.status === 'pending' && (
              <div className="flex space-x-4">
                <Button 
                  onClick={() => setSelectedAction('approve')}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setSelectedAction('reject')}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            )}
            
            {selectedAction && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Are you sure you want to {selectedAction} this application?
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" onClick={handleSubmitReview}>
                      Confirm {selectedAction === 'approve' ? 'Approval' : 'Rejection'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedAction(null)}>
                      Cancel
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationDetails({ 
  application, 
  isAdmin 
}: { 
  application: AdmissionApplication;
  isAdmin: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center space-x-2">
            <UserIcon className="h-4 w-4" />
            <span>Full Name</span>
          </Label>
          <p className="text-lg">{application.studentName}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email Address</span>
          </Label>
          <p>{application.email}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Phone Number</span>
          </Label>
          <p>{application.phone}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Course Applied</span>
          </Label>
          <Badge variant="outline" className="text-sm">{application.course}</Badge>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Application Date</span>
          </Label>
          <p>{new Date(application.applicationDate).toLocaleDateString()}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Application Fee</Label>
          <Badge variant={application.feesPaid ? 'default' : 'destructive'}>
            {application.feesPaid ? 'Paid' : 'Pending'}
          </Badge>
        </div>
      </div>

      {isAdmin && application.reviewDate && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Review Information</h4>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label className="text-sm font-semibold">Review Date</Label>
              <p>{new Date(application.reviewDate).toLocaleDateString()}</p>
            </div>
            {application.reviewRemarks && (
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold">Review Remarks</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{application.reviewRemarks}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NewApplicationForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    course: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(formData);
      
      // Reset form
      setFormData({
        course: ''
      });
      
      // Close dialog (you might want to pass a close function as prop)
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="course">Course *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, course: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science Engineering</SelectItem>
              <SelectItem value="Electronics">Electronics Engineering</SelectItem>
              <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
              <SelectItem value="Civil">Civil Engineering</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Once submitted, your application will be reviewed by the admissions committee. 
          You will be notified of the decision via email.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting || !formData.course}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}