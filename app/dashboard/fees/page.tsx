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
import { 
  CreditCard, 
  Plus, 
  Download, 
  Search,
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { mockFees, FeeRecord, getStudentData, updateFeeStatus } from '@/lib/mockData';

export default function FeesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [fees, setFees] = useState<FeeRecord[]>(mockFees);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const router = useRouter();

  // Add ref for search bar
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search bar
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

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

  const handlePayFee = (feeId: string) => {
    const paidDate = new Date().toISOString().split('T')[0];
    const receiptNumber = `RCP-${Date.now()}`;
    
    // Update the mock data
    updateFeeStatus(feeId, 'paid', paidDate, receiptNumber);
    
    // Update local state to trigger re-render
    setFees([...mockFees]);
  };

  const filteredFees = user.role === 'admin' 
    ? fees.filter(fee => {
        const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             fee.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : fees.filter(fee => fee.studentId === user.studentId);

  const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);
  const overdueCount = fees.filter(f => f.status === 'overdue').length;

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">Manage student fee payments and receipts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Collect Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Collect Fee Payment</DialogTitle>
                <DialogDescription>Record a new fee payment</DialogDescription>
              </DialogHeader>
              <CollectPaymentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(pendingAmount / 1000)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((totalRevenue / (totalRevenue + pendingAmount)) * 100)}%
            </div>
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
                <Input
                  id="search"
                  placeholder="Search by student name or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={searchInputRef}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Records ({filteredFees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{fee.studentName}</p>
                      <p className="text-sm text-muted-foreground">{fee.studentId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{fee.type}</TableCell>
                  <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        fee.status === 'paid' ? 'default' : 
                        fee.status === 'overdue' ? 'destructive' : 'secondary'
                      }
                    >
                      {fee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {fee.status === 'paid' && fee.receiptNumber && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Payment Receipt</DialogTitle>
                            </DialogHeader>
                            <ReceiptView fee={fee} />
                          </DialogContent>
                        </Dialog>
                      )}
                      {fee.status !== 'paid' && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePayFee(fee.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
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

  const studentData = getStudentData(user.studentId || '');

  const StudentView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Fees</h1>
        <p className="text-muted-foreground">View and manage your fee payments</p>
      </div>

      {/* Student Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(studentData.totalFeesPaid / 1000)}K
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{(studentData.pendingFees / 1000)}K
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Feb 15</div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records */}
      <Card>
        <CardHeader>
          <CardTitle>Fee History</CardTitle>
          <CardDescription>Your payment history and upcoming dues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{fee.type} Fee</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(fee.dueDate).toLocaleDateString()}
                    {fee.paidDate && ` • Paid: ${new Date(fee.paidDate).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{fee.amount.toLocaleString()}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={
                        fee.status === 'paid' ? 'default' : 
                        fee.status === 'overdue' ? 'destructive' : 'secondary'
                      }
                    >
                      {fee.status}
                    </Badge>
                    {fee.status !== 'paid' && (
                      <Button size="sm" onClick={() => handlePayFee(fee.id)}>
                        Pay Now
                      </Button>
                    )}
                    {fee.status === 'paid' && fee.receiptNumber && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payment Receipt</DialogTitle>
                          </DialogHeader>
                          <ReceiptView fee={fee} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="fees" />
      <main className="container mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminView /> : <StudentView />}
      </main>
    </div>
  );
}

function CollectPaymentForm() {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    type: '',
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Collecting payment:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student-id">Student ID</Label>
        <Input
          id="student-id"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          placeholder="CS2024001"
          required
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="50000"
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Fee Type</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select fee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tuition">Tuition Fee</SelectItem>
            <SelectItem value="hostel">Hostel Fee</SelectItem>
            <SelectItem value="library">Library Fee</SelectItem>
            <SelectItem value="exam">Exam Fee</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="due-date">Due Date</Label>
        <Input
          id="due-date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
        <Button type="submit">Collect Payment</Button>
      </div>
    </form>
  );
}

function ReceiptView({ fee }: { fee: FeeRecord }) {
  return (
    <div className="space-y-6 p-6 bg-white border-2 border-dashed border-gray-300">
      <div className="text-center">
        <h2 className="text-2xl font-bold">EFA</h2>
        <p className="text-muted-foreground">Payment Receipt</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="font-semibold">Receipt No.</Label>
          <p>{fee.receiptNumber}</p>
        </div>
        <div>
          <Label className="font-semibold">Date</Label>
          <p>{fee.paidDate && new Date(fee.paidDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="font-semibold">Student Name</Label>
          <p>{fee.studentName}</p>
        </div>
        <div>
          <Label className="font-semibold">Student ID</Label>
          <p>{fee.studentId}</p>
        </div>
        <div>
          <Label className="font-semibold">Fee Type</Label>
          <p className="capitalize">{fee.type} Fee</p>
        </div>
        <div>
          <Label className="font-semibold">Amount</Label>
          <p className="text-lg font-bold">₹{fee.amount.toLocaleString()}</p>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground border-t pt-4">
        <p>This is a computer-generated receipt. No signature required.</p>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
      </div>
    </div>
  );
}